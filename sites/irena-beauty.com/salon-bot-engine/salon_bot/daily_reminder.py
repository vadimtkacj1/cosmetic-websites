from __future__ import annotations

"""
Scheduled mode: two Telegram digests per day (tomorrow's bookings) —
primary time from settings + end-of-day catch-up (23:00 or 23:59).

Instant mode: handled by the Next.js app (TELEGRAM_BOT_TOKEN); bot skips scheduling.

Config: data/notification-settings.json (+ env fallbacks). Re-read each loop iteration.
"""

import asyncio
import logging
from datetime import datetime, timedelta, timezone
from typing import Any
from zoneinfo import ZoneInfo

from salon_bot.notification_settings import load_notification_config
from salon_bot.rtl_text import rtl
from salon_bot.telegram_outbound import queue_telegram_messages
from salon_bot.tenants_store import bookings_for_calendar_date, list_telegram_broadcast_entries

logger = logging.getLogger(__name__)


def tomorrow_iso_in_tz(tz_name: str, *, now: datetime | None = None) -> str:
    """Calendar 'tomorrow' YYYY-MM-DD in the given IANA timezone."""
    if now is None:
        now = datetime.now(timezone.utc)
    tz = ZoneInfo(tz_name)
    local = now.astimezone(tz).date()
    return (local + timedelta(days=1)).isoformat()


def seconds_until_next_reminder(
    hhmm: str,
    tz_name: str,
    *,
    now: datetime | None = None,
) -> float:
    """Seconds from `now` (UTC) until next local clock time hh:mm in tz_name."""
    if now is None:
        now = datetime.now(timezone.utc)
    tz = ZoneInfo(tz_name)
    parts = hhmm.split(":")
    h, mi = int(parts[0]), int(parts[1])
    local_now = now.astimezone(tz)
    target = local_now.replace(hour=h, minute=mi, second=0, microsecond=0)
    if local_now >= target:
        target = target + timedelta(days=1)
    delta = target.astimezone(timezone.utc) - now.astimezone(timezone.utc)
    sec = delta.total_seconds()
    return max(1.0, sec)


def format_tomorrow_reminder_message(
    tenant_id: str,
    tenant_label: str,
    tomorrow_iso: str,
) -> str:
    rows = bookings_for_calendar_date(tenant_id, tomorrow_iso)
    studio = (tenant_label or "").strip()
    if studio:
        lines = [f"תזכורת לסטודיו — {studio}", f"מחר ({tomorrow_iso})", ""]
    else:
        lines = ["תזכורת לתורים מחר", f"תאריך: {tomorrow_iso}", ""]
    if not rows:
        lines.append("אין תורים מתוכננים למחר.")
        return rtl("\n".join(lines))
    lines.append("תורים מחר:")
    lines.append("")
    for b in rows:
        nm = str(b.get("name") or "—").strip()
        ph = str(b.get("phone") or "—").strip()
        tm = str(b.get("time") or "—")
        lines.append(f"• {nm} · {tm} · {ph}")
    return rtl("\n".join(lines))


async def send_tomorrow_reminders(app: Any, tz_name: str) -> None:
    tomorrow = tomorrow_iso_in_tz(tz_name)
    entries = list_telegram_broadcast_entries()
    if not entries:
        logger.info("daily reminder: no telegram subscribers; skip")
        return
    pairs: list[tuple[str, str]] = [
        (ent.chat_id, format_tomorrow_reminder_message(ent.tenant_id, ent.tenant_label, tomorrow))
        for ent in entries
    ]
    ok, err = await queue_telegram_messages(app, pairs)
    logger.info(
        "daily reminder: tomorrow=%s tz=%s sent=%s errors=%s recipients=%s",
        tomorrow,
        tz_name,
        ok,
        err,
        len(entries),
    )


async def daily_reminder_loop(app: Any) -> None:
    logger.info("Daily reminder scheduler started (scheduled mode: primary + end-of-day)")
    while True:
        try:
            cfg = load_notification_config()
            if not cfg.enabled or cfg.mode != "scheduled":
                await asyncio.sleep(120.0)
                continue
            now = datetime.now(timezone.utc)
            s_primary = seconds_until_next_reminder(
                cfg.primary_hhmm, cfg.timezone, now=now
            )
            s_catch = seconds_until_next_reminder(
                cfg.catchup_hhmm, cfg.timezone, now=now
            )
            sec = min(s_primary, s_catch)
            which = "primary" if sec == s_primary else "catchup"
            logger.info(
                "Daily reminder: sleep %.0fs until %s (%s or %s local)",
                sec,
                which,
                cfg.primary_hhmm,
                cfg.catchup_hhmm,
            )
            await asyncio.sleep(sec)
            cfg2 = load_notification_config()
            if cfg2.enabled and cfg2.mode == "scheduled":
                await send_tomorrow_reminders(app, cfg2.timezone)
        except asyncio.CancelledError:
            logger.info("Daily reminder loop cancelled")
            raise
        except Exception:
            logger.exception("daily reminder loop error; retry in 60s")
            await asyncio.sleep(60.0)
