from __future__ import annotations

import json
from datetime import datetime, timezone

import pytest

from salon_bot.daily_reminder import (
    format_tomorrow_reminder_message,
    seconds_until_next_reminder,
    tomorrow_iso_in_tz,
)
from salon_bot.notification_settings import (
    load_effective_notification_config,
    load_notification_config,
    resolve_catchup_hhmm,
)
from salon_bot.tenants_store import bookings_for_calendar_date


def test_tomorrow_iso_in_tz():
    now = datetime(2026, 5, 1, 22, 0, tzinfo=timezone.utc)
    assert tomorrow_iso_in_tz("Asia/Jerusalem", now=now) == "2026-05-03"


def test_seconds_until_next_reminder_positive():
    now = datetime(2026, 5, 1, 10, 0, tzinfo=timezone.utc)
    sec = seconds_until_next_reminder("20:00", "Asia/Jerusalem", now=now)
    assert 1.0 <= sec <= 86400.0


def test_effective_config_from_env(monkeypatch, tmp_path):
    monkeypatch.setenv("SALON_DATA_DIR", str(tmp_path))
    monkeypatch.setenv("SALON_DAILY_REMINDER_TIME", "9:30")
    en, hhmm, tz = load_effective_notification_config()
    assert hhmm == "09:30"
    monkeypatch.setenv("SALON_DAILY_REMINDER_TIME", "bad")
    _, hhmm2, _ = load_effective_notification_config()
    assert hhmm2 == "20:00"


def test_effective_config_json_overrides_env(monkeypatch, tmp_path):
    monkeypatch.setenv("SALON_DATA_DIR", str(tmp_path))
    monkeypatch.setenv("SALON_DAILY_REMINDER_TIME", "10:00")
    monkeypatch.setenv("SALON_TIMEZONE", "Asia/Jerusalem")
    (tmp_path / "notification-settings.json").write_text(
        json.dumps(
            {"enabled": False, "timeLocal": "21:15", "timezone": "UTC"},
            ensure_ascii=False,
        ),
        encoding="utf-8",
    )
    en, hhmm, tz = load_effective_notification_config()
    assert en is False
    assert hhmm == "21:15"
    assert tz == "UTC"
    cfg = load_notification_config()
    assert cfg.mode == "scheduled"
    assert cfg.catchup_hhmm == "23:00"


def test_instant_mode_in_json(monkeypatch, tmp_path):
    monkeypatch.setenv("SALON_DATA_DIR", str(tmp_path))
    (tmp_path / "notification-settings.json").write_text(
        json.dumps(
            {"enabled": True, "mode": "instant", "timeLocal": "18:00", "timezone": "UTC"}
        ),
        encoding="utf-8",
    )
    cfg = load_notification_config()
    assert cfg.mode == "instant"


def test_resolve_catchup():
    assert resolve_catchup_hhmm("18:00") == "23:00"
    assert resolve_catchup_hhmm("23:30") == "23:59"


def test_bookings_for_calendar_date(monkeypatch, tmp_path):
    monkeypatch.setenv("SALON_DATA_DIR", str(tmp_path))
    data = [
        {
            "tenantId": "t1",
            "date": "2099-06-10",
            "time": "14:00",
            "name": "Late",
            "phone": "1",
        },
        {
            "tenantId": "t1",
            "date": "2099-06-10",
            "time": "09:00",
            "name": "Early",
            "phone": "2",
        },
        {
            "tenantId": "t1",
            "date": "2099-06-11",
            "time": "10:00",
            "name": "Other",
            "phone": "3",
        },
    ]
    (tmp_path / "bookings.json").write_text(json.dumps(data), encoding="utf-8")
    rows = bookings_for_calendar_date("t1", "2099-06-10")
    assert [r["name"] for r in rows] == ["Early", "Late"]


def test_format_tomorrow_reminder_empty(monkeypatch, tmp_path):
    monkeypatch.setenv("SALON_DATA_DIR", str(tmp_path))
    (tmp_path / "bookings.json").write_text("[]", encoding="utf-8")
    text = format_tomorrow_reminder_message("t1", "מספרה", "2099-01-02")
    assert "2099-01-02" in text
    assert "אין תורים" in text


def test_format_tomorrow_reminder_with_rows(monkeypatch, tmp_path):
    monkeypatch.setenv("SALON_DATA_DIR", str(tmp_path))
    (tmp_path / "bookings.json").write_text(
        json.dumps(
            [
                {
                    "tenantId": "t1",
                    "date": "2099-01-02",
                    "time": "11:00",
                    "name": "דנה",
                    "phone": "050",
                }
            ]
        ),
        encoding="utf-8",
    )
    text = format_tomorrow_reminder_message("t1", "X", "2099-01-02")
    assert "דנה" in text
    assert "11:00" in text
    assert "050" in text
