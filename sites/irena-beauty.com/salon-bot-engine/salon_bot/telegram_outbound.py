from __future__ import annotations

import asyncio
import logging
import os
from dataclasses import dataclass

from telegram import Bot
from telegram.error import BadRequest, Forbidden, NetworkError, RetryAfter, TelegramError

logger = logging.getLogger(__name__)


@dataclass
class _SendJob:
    chat_id: str
    text: str
    done: asyncio.Future[bool]


def _min_interval_sec() -> float:
    v = (os.getenv("TELEGRAM_SEND_MIN_INTERVAL_SEC") or "0.06").strip()
    try:
        return max(0.02, float(v))
    except ValueError:
        return 0.06


def _queue_maxsize() -> int:
    v = (os.getenv("TELEGRAM_OUTBOUND_QUEUE_MAX") or "50000").strip()
    try:
        return max(100, int(v))
    except ValueError:
        return 50000


def _chat_id_arg(chat_id: str) -> int | str:
    s = (chat_id or "").strip()
    try:
        return int(s)
    except ValueError:
        return s


async def _send_with_retry(bot: Bot, chat_id: str, text: str) -> bool:
    cid = _chat_id_arg(chat_id)
    attempt = 0
    while True:
        attempt += 1
        try:
            await bot.send_message(chat_id=cid, text=text)
            return True
        except RetryAfter as e:
            wait = float(getattr(e, "retry_after", 5)) + 0.5
            logger.warning(
                "Telegram Flood control chat_id=%s retry_after=%s (attempt %s)",
                chat_id,
                wait,
                attempt,
            )
            await asyncio.sleep(wait)
        except (Forbidden, BadRequest) as e:
            logger.warning("Telegram send rejected chat_id=%s: %s", chat_id, e)
            return False
        except NetworkError as e:
            if attempt >= 5:
                logger.exception("Telegram network error chat_id=%s", chat_id)
                return False
            logger.warning("Telegram network error chat_id=%s retry in 3s: %s", chat_id, e)
            await asyncio.sleep(3.0)
        except TelegramError as e:
            logger.exception("Telegram error chat_id=%s: %s", chat_id, e)
            return False


async def _worker_loop(app) -> None:
    q: asyncio.Queue[_SendJob | None] = app.bot_data["outbound_queue"]
    bot = app.bot
    delay = _min_interval_sec()
    logger.info("Telegram outbound worker started (min interval %.3fs, queue max %s)", delay, q.maxsize)

    while True:
        job = await q.get()
        try:
            if job is None:
                break
            ok = await _send_with_retry(bot, job.chat_id, job.text)
            if not job.done.done():
                job.done.set_result(ok)
        except Exception:
            logger.exception("outbound worker unexpected error")
            if job is not None and not job.done.done():
                job.done.set_result(False)
        finally:
            q.task_done()
        await asyncio.sleep(delay)


async def attach_outbound_worker(app) -> None:
    if app.bot_data.get("outbound_worker_task"):
        return
    app.bot_data["outbound_queue"] = asyncio.Queue(maxsize=_queue_maxsize())
    app.bot_data["outbound_stop"] = asyncio.Event()
    app.bot_data["outbound_worker_task"] = asyncio.create_task(
        _worker_loop(app),
        name="salon-tg-outbound",
    )


async def detach_outbound_worker(app) -> None:
    q = app.bot_data.get("outbound_queue")
    t: asyncio.Task | None = app.bot_data.get("outbound_worker_task")
    stop: asyncio.Event | None = app.bot_data.get("outbound_stop")
    if not q or not t:
        return
    if stop:
        stop.set()
    await q.join()
    await q.put(None)
    try:
        await asyncio.wait_for(t, timeout=120.0)
    except asyncio.TimeoutError:
        logger.warning("outbound worker shutdown timeout, cancelling")
        t.cancel()
        try:
            await t
        except asyncio.CancelledError:
            pass
    app.bot_data.pop("outbound_worker_task", None)
    logger.info("Telegram outbound worker stopped")


async def queue_telegram_messages(app, pairs: list[tuple[str, str]]) -> tuple[int, int]:
    """
    Enqueue many texts; waits until all are processed. Returns (ok_count, error_count).
    """
    if not pairs:
        return 0, 0
    q = app.bot_data.get("outbound_queue")
    if q is None:
        raise RuntimeError("outbound queue not initialized (post_init missing?)")

    loop = asyncio.get_running_loop()
    futures: list[asyncio.Future[bool]] = []
    for chat_id, text in pairs:
        fut: asyncio.Future[bool] = loop.create_future()
        await q.put(_SendJob(chat_id=chat_id, text=text, done=fut))
        futures.append(fut)

    results = await asyncio.gather(*futures)
    ok = sum(1 for r in results if r)
    err = len(results) - ok
    return ok, err
