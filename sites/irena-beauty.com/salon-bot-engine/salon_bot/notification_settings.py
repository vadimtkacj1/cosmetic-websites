from __future__ import annotations

import json
import logging
import os
from dataclasses import dataclass
from pathlib import Path

from salon_bot.tenants_store import salon_data_dir

logger = logging.getLogger(__name__)

SETTINGS_FILENAME = "notification-settings.json"


@dataclass(frozen=True)
class NotificationConfig:
    enabled: bool
    mode: str  # "scheduled" | "instant"
    primary_hhmm: str
    catchup_hhmm: str
    timezone: str


def _env_enabled() -> bool:
    v = (os.getenv("SALON_DAILY_REMINDER_ENABLE") or "1").strip().lower()
    return v in ("1", "true", "yes", "on")


def _mode_from_env() -> str:
    v = (os.getenv("SALON_NOTIFICATION_MODE") or "scheduled").strip().lower()
    return "instant" if v == "instant" else "scheduled"


def _normalize_hhmm(raw: str | None, *, default: str) -> str:
    if raw is None:
        return default
    s = str(raw).strip().replace(".", ":")
    parts = s.split(":")
    if len(parts) < 2:
        return default
    try:
        h = max(0, min(23, int(parts[0])))
        m = max(0, min(59, int(parts[1])))
        return f"{h:02d}:{m:02d}"
    except ValueError:
        return default


def _reminder_time_from_env() -> str:
    return _normalize_hhmm(os.getenv("SALON_DAILY_REMINDER_TIME"), default="20:00")


def _timezone_from_env() -> str:
    return (os.getenv("SALON_TIMEZONE") or "Asia/Jerusalem").strip() or "Asia/Jerusalem"


def _parse_bool(val: object, *, default: bool) -> bool:
    if val is None:
        return default
    if isinstance(val, bool):
        return val
    s = str(val).strip().lower()
    if s in ("1", "true", "yes", "on"):
        return True
    if s in ("0", "false", "no", "off"):
        return False
    return default


def resolve_catchup_hhmm(primary_hhmm: str) -> str:
    """Second daily send: end-of-day snapshot for bookings made after the primary time."""
    parts = primary_hhmm.split(":")
    ph, pm = int(parts[0]), int(parts[1])
    primary_m = ph * 60 + pm
    if primary_m >= 23 * 60:
        return "23:59"
    return "23:00"


def settings_file_path() -> Path:
    return salon_data_dir() / SETTINGS_FILENAME


def load_notification_config() -> NotificationConfig:
    env_en = _env_enabled()
    env_mode = _mode_from_env()
    env_hhmm = _reminder_time_from_env()
    env_tz = _timezone_from_env()
    env_catch = resolve_catchup_hhmm(env_hhmm)
    path = settings_file_path()
    if not path.exists():
        return NotificationConfig(
            enabled=env_en,
            mode=env_mode,
            primary_hhmm=env_hhmm,
            catchup_hhmm=env_catch,
            timezone=env_tz,
        )
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        logger.warning("notification_settings: invalid JSON %s", path)
        return NotificationConfig(
            enabled=env_en,
            mode=env_mode,
            primary_hhmm=env_hhmm,
            catchup_hhmm=env_catch,
            timezone=env_tz,
        )
    if not isinstance(data, dict):
        return NotificationConfig(
            enabled=env_en,
            mode=env_mode,
            primary_hhmm=env_hhmm,
            catchup_hhmm=env_catch,
            timezone=env_tz,
        )
    en = _parse_bool(data.get("enabled"), default=env_en)
    if "mode" in data:
        mode_raw = str(data.get("mode") or "").strip().lower()
        mode = "instant" if mode_raw == "instant" else "scheduled"
    else:
        mode = env_mode
    hhmm = _normalize_hhmm(
        data.get("timeLocal") if data.get("timeLocal") is not None else None,
        default=env_hhmm,
    )
    tz_raw = data.get("timezone")
    tz = str(tz_raw).strip() if tz_raw is not None else ""
    if not tz:
        tz = env_tz
    catch = resolve_catchup_hhmm(hhmm)
    return NotificationConfig(
        enabled=en,
        mode=mode,
        primary_hhmm=hhmm,
        catchup_hhmm=catch,
        timezone=tz,
    )


# Backwards compat for tests importing old name
def load_effective_notification_config() -> tuple[bool, str, str]:
    c = load_notification_config()
    return c.enabled, c.primary_hhmm, c.timezone
