from __future__ import annotations

import json
import logging
import os
import threading
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Literal

from salon_bot.rtl_text import rtl

logger = logging.getLogger(__name__)
_lock = threading.Lock()

ACK_NEW_HE = rtl(
    "נרשמתם לרשימת התפוצה. נעדכן אתכם במבצעים, חדשות ותזכורות ליד לקוחות שקבעו תור."
)
ACK_AGAIN_HE = rtl("כבר קיבלנו את ההרשמה שלכם — תודה!")
Channel = Literal["telegram", "whatsapp"]
HINT_HE = rtl(
    "שלחו את קוד ההרשמה (בדיוק כפי שמופיע באדמין) כדי להצטרף לעדכונים מהסטודיו."
)


@dataclass(frozen=True)
class TelegramBroadcastEntry:
    tenant_id: str
    tenant_label: str
    subscribe_code: str
    chat_id: str
    username: str | None
    subscribed_at: str


def _normalize_code(s: str) -> str:
    return "".join((s or "").split()).upper()


def _repo_data_root() -> Path:
    return Path(__file__).resolve().parents[2] / "data"


def salon_data_dir() -> Path:
    """Folder with messenger-tenants.json and bookings.json."""
    return broadcast_json_path().parent


def broadcast_json_path() -> Path:
    env = (os.getenv("SALON_TENANTS_JSON") or os.getenv("SALON_BROADCAST_JSON") or "").strip()
    if env:
        return Path(env)
    data_dir = (os.getenv("SALON_DATA_DIR") or "").strip()
    if data_dir:
        base = Path(data_dir).resolve()
        modern = base / "messenger-tenants.json"
        if modern.exists():
            return modern
        return base / "messenger-broadcast.json"
    modern = _repo_data_root() / "messenger-tenants.json"
    if modern.exists():
        return modern
    return _repo_data_root() / "messenger-broadcast.json"


def _load_unlocked(path: Path) -> dict[str, Any]:
    if not path.exists():
        return {}
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
        return data if isinstance(data, dict) else {}
    except Exception:
        logger.exception("tenants_store: read failed %s", path)
        return {}


def _save_unlocked(path: Path, data: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def _tenants_map_from_file(data: dict[str, Any]) -> dict[str, dict[str, Any]]:
    if "tenants" in data and isinstance(data["tenants"], dict):
        return {str(k): v for k, v in data["tenants"].items() if isinstance(v, dict) and k}
    if "subscribeCode" in data:
        return {
            "default": {
                "label": str(data.get("label") or ""),
                "subscribeCode": str(data.get("subscribeCode") or ""),
                "telegram": data.get("telegram") if isinstance(data.get("telegram"), list) else [],
                "whatsapp": data.get("whatsapp") if isinstance(data.get("whatsapp"), list) else [],
            }
        }
    return {}


def _wrap_v1(tenants: dict[str, dict[str, Any]]) -> dict[str, Any]:
    return {"version": 1, "tenants": tenants}


def try_subscribe(
    channel: Channel,
    channel_id: str,
    text: str,
    *,
    username: str | None = None,
) -> str | None:
    needle = _normalize_code(text)
    if not needle or not channel_id:
        return None

    path = broadcast_json_path()
    with _lock:
        raw = _load_unlocked(path)
        tenants = _tenants_map_from_file(raw)
        if not tenants:
            logger.warning("tenants_store: no tenants in %s — open site /admin/messenger", path)
            return None

        matched: str | None = None
        for tid, t in tenants.items():
            c = _normalize_code(str(t.get("subscribeCode") or ""))
            if c and needle == c:
                matched = tid
                break
        if not matched:
            return None

        t = tenants[matched]
        key_list = "telegram" if channel == "telegram" else "whatsapp"
        lst: list[dict[str, Any]] = (
            t.get(key_list) if isinstance(t.get(key_list), list) else []
        )
        t[key_list] = lst

        exists = any(str(x.get("chatId") or "") == channel_id for x in lst)
        if not exists:
            row: dict[str, Any] = {"chatId": channel_id, "subscribedAt": datetime.now(timezone.utc).isoformat()}
            if channel == "telegram" and username:
                row["username"] = username
            lst.append(row)
            tenants[matched] = t
            out_path = path if path.name == "messenger-tenants.json" else path.with_name("messenger-tenants.json")
            _save_unlocked(out_path, _wrap_v1(tenants))
            logger.info("subscribe new %s %s tenant=%s", channel, channel_id, matched)
            return ACK_NEW_HE

        logger.info("subscribe duplicate %s %s tenant=%s", channel, channel_id, matched)
        return ACK_AGAIN_HE


def list_telegram_broadcast_entries() -> list[TelegramBroadcastEntry]:
    path = broadcast_json_path()
    with _lock:
        raw = _load_unlocked(path)
    tenants = _tenants_map_from_file(raw)
    seen: set[str] = set()
    out: list[TelegramBroadcastEntry] = []
    for tid, t in tenants.items():
        label = str(t.get("label") or "").strip()
        code = str(t.get("subscribeCode") or "").strip()
        lst = t.get("telegram")
        if not isinstance(lst, list):
            continue
        for row in lst:
            if not isinstance(row, dict):
                continue
            cid = str(row.get("chatId") or "").strip()
            if not cid or cid in seen:
                continue
            seen.add(cid)
            ru = row.get("username")
            uname = str(ru).strip() if ru else ""
            if uname.startswith("@"):
                uname = uname[1:]
            uname = uname or None
            sat = str(row.get("subscribedAt") or "").strip()
            out.append(
                TelegramBroadcastEntry(
                    tenant_id=str(tid),
                    tenant_label=label,
                    subscribe_code=code,
                    chat_id=cid,
                    username=uname,
                    subscribed_at=sat or "—",
                )
            )
    return out


def all_telegram_chat_ids() -> list[str]:
    return [e.chat_id for e in list_telegram_broadcast_entries()]


def _booking_row_tenant_id(row: dict[str, Any]) -> str:
    tid = row.get("tenantId") or row.get("tenant_id") or "default"
    s = str(tid).strip()
    return s if s else "default"


def _load_bookings_list_unlocked() -> list[dict[str, Any]]:
    path = salon_data_dir() / "bookings.json"
    if not path.exists():
        return []
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        logger.exception("tenants_store: bookings read failed %s", path)
        return []
    if not isinstance(data, list):
        return []
    return [x for x in data if isinstance(x, dict)]


def bookings_for_calendar_date(tenant_id: str, iso_date: str) -> list[dict[str, Any]]:
    """Bookings for one tenant on exact calendar day YYYY-MM-DD, sorted by time."""
    rows = [
        r
        for r in _load_bookings_list_unlocked()
        if _booking_row_tenant_id(r) == tenant_id and str(r.get("date") or "") == iso_date
    ]
    rows.sort(key=lambda r: str(r.get("time") or ""))
    return rows


def bookings_for_test_broadcast(tenant_id: str, *, limit: int = 12) -> tuple[list[dict[str, Any]], str]:
    """
    Bookings for one tenant, for /test preview (like a real reminder blast).
    Returns (rows, kind) where kind is 'upcoming' | 'recent' | 'empty'.
    """
    today = datetime.now(timezone.utc).date().isoformat()
    rows = [r for r in _load_bookings_list_unlocked() if _booking_row_tenant_id(r) == tenant_id]
    upcoming = [r for r in rows if str(r.get("date") or "") >= today]
    upcoming.sort(key=lambda r: (str(r.get("date") or ""), str(r.get("time") or "")))
    if upcoming:
        return upcoming[:limit], "upcoming"
    past = sorted(
        rows,
        key=lambda r: (str(r.get("date") or ""), str(r.get("time") or "")),
        reverse=True,
    )
    if past:
        return past[:limit], "recent"
    return [], "empty"
