from __future__ import annotations

import asyncio
import logging
import os

from telegram import Update
from telegram.ext import (
    Application,
    CommandHandler,
    ContextTypes,
    MessageHandler,
    filters,
)

from salon_bot.daily_reminder import daily_reminder_loop
from salon_bot.telegram_outbound import (
    attach_outbound_worker,
    detach_outbound_worker,
    queue_telegram_messages,
)
from salon_bot.rtl_text import rtl
from salon_bot.tenants_store import (
    HINT_HE,
    bookings_for_test_broadcast,
    list_telegram_broadcast_entries,
    try_subscribe,
)

logger = logging.getLogger(__name__)

PING_HE = rtl("בדיקה: הבוט פעיל.")
PING_ADMIN_HINT_HE = rtl(
    "בדיקה: הבוט פעיל. לשליחת הודעת בדיקה לכל מנויי טלגרם, "
    "הגדירו SALON_BROADCAST_ADMIN_CHAT_IDS ב-.env (מזהה הצ'אט שלכם בטלגרם)."
)


def _broadcast_admin_ids() -> set[str]:
    raw = (os.getenv("SALON_BROADCAST_ADMIN_CHAT_IDS") or "").strip()
    return {x.strip() for x in raw.split(",") if x.strip()}


def _test_broadcast_message(tenant_id: str, tenant_label: str) -> str:
    """Customer-style text only: who booked, when, phone — no subscriber / tenant tech details."""
    rows, kind = bookings_for_test_broadcast(tenant_id, limit=12)
    studio = (tenant_label or "").strip()
    if studio:
        lines = [f"תזכורת — {studio}", ""]
    else:
        lines = ["תזכורת ללקוחות שקבעו תור", ""]
    if kind == "empty":
        lines.append("כרגע אין הזמנות להצגה.")
        lines.append("כשנרשמו תורים דרך האתר — יופיעו כאן שם, תאריך, שעה וטלפון.")
        return rtl("\n".join(lines))
    if kind == "upcoming":
        lines.append("תורים קרובים:")
    else:
        lines.append("תורים אחרונים (בקובץ אין תאריך עתידי):")
    lines.append("")
    for b in rows:
        nm = str(b.get("name") or "—").strip()
        ph = str(b.get("phone") or "—").strip()
        dt = str(b.get("date") or "—")
        tm = str(b.get("time") or "—")
        lines.append(f"• {nm} · {dt} · {tm} · {ph}")
    return rtl("\n".join(lines))


def _is_test_trigger(text: str) -> bool:
    s = "".join(text.strip().split()).casefold()
    if s == "test":
        return True
    if s.startswith("/"):
        cmd = s.split("@", 1)[0]
        if cmd == "/test":
            return True
    return False


async def run_test(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if not update.message or not update.effective_chat:
        return
    chat_id = str(update.effective_chat.id)
    admins = _broadcast_admin_ids()
    if admins and chat_id in admins:
        entries = list_telegram_broadcast_entries()
        pairs = [
            (ent.chat_id, _test_broadcast_message(ent.tenant_id, ent.tenant_label))
            for ent in entries
        ]
        ok, err = await queue_telegram_messages(context.application, pairs)
        logger.info("/test: sent=%s errors=%s recipients=%s (queued)", ok, err, len(entries))
        return
    await update.message.reply_text(PING_ADMIN_HINT_HE if not admins else PING_HE)


async def cmd_test(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await run_test(update, context)


async def cmd_start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if not update.message:
        return
    await update.message.reply_text(
        rtl("שלום! שלחו את קוד ההרשמה מהאדמין. בדיקה: /test")
    )


async def on_text(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if not update.message or not update.effective_chat or not update.message.text:
        return
    chat_id = str(update.effective_chat.id)
    text = update.message.text.strip()
    if _is_test_trigger(text):
        await run_test(update, context)
        return
    uname = update.effective_user.username if update.effective_user else None
    ack = try_subscribe("telegram", chat_id, text, username=uname)
    if ack:
        await update.message.reply_text(ack)
        return
    if len("".join(text.split())) <= 16:
        await update.message.reply_text(HINT_HE)


def run_telegram_bot(token: str) -> None:
    async def _post_init(app: Application) -> None:
        await attach_outbound_worker(app)
        t = asyncio.create_task(daily_reminder_loop(app), name="salon-daily-reminder")
        app.bot_data["daily_reminder_task"] = t

    async def _post_shutdown(app: Application) -> None:
        t: asyncio.Task | None = app.bot_data.get("daily_reminder_task")
        if t:
            t.cancel()
            try:
                await t
            except asyncio.CancelledError:
                pass
            app.bot_data.pop("daily_reminder_task", None)
        await detach_outbound_worker(app)

    app = (
        Application.builder()
        .token(token)
        .concurrent_updates(True)
        .post_init(_post_init)
        .post_shutdown(_post_shutdown)
        .build()
    )
    app.add_handler(CommandHandler("start", cmd_start))
    app.add_handler(CommandHandler("test", cmd_test))
    app.add_handler(MessageHandler(filters.TEXT, on_text))
    logger.info("Salon Telegram bot polling (subscribe engine). Ctrl+C to stop.")
    app.run_polling(allowed_updates=Update.ALL_TYPES)
