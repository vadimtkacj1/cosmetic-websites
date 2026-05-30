from __future__ import annotations

import json

import pytest

from salon_bot import telegram_app as ta


def test_is_test_trigger():
    assert ta._is_test_trigger("test") is True
    assert ta._is_test_trigger("  /test  ") is True
    assert ta._is_test_trigger("/test@SomeBot") is True
    assert ta._is_test_trigger("TEST") is True
    assert ta._is_test_trigger("hello") is False
    assert ta._is_test_trigger("/start") is False


def test_broadcast_admin_ids(monkeypatch):
    monkeypatch.setenv("SALON_BROADCAST_ADMIN_CHAT_IDS", " 1 , 2 , ")
    assert ta._broadcast_admin_ids() == {"1", "2"}
    monkeypatch.delenv("SALON_BROADCAST_ADMIN_CHAT_IDS", raising=False)
    assert ta._broadcast_admin_ids() == set()


def test_test_broadcast_message_empty(monkeypatch, tmp_path):
    monkeypatch.setenv("SALON_DATA_DIR", str(tmp_path))
    (tmp_path / "bookings.json").write_text("[]", encoding="utf-8")
    text = ta._test_broadcast_message("t1", "סטודיו")
    assert "סטודיו" in text
    assert "אין הזמנות" in text or "כרגע אין" in text


def test_test_broadcast_message_upcoming(monkeypatch, tmp_path):
    monkeypatch.setenv("SALON_DATA_DIR", str(tmp_path))
    rows = [
        {
            "tenantId": "t1",
            "name": "שרה",
            "phone": "050",
            "date": "2099-06-15",
            "time": "14:00",
        }
    ]
    (tmp_path / "bookings.json").write_text(json.dumps(rows), encoding="utf-8")
    text = ta._test_broadcast_message("t1", "")
    assert "שרה" in text
    assert "2099-06-15" in text
    assert "050" in text


def test_test_broadcast_message_other_tenant_excluded(monkeypatch, tmp_path):
    monkeypatch.setenv("SALON_DATA_DIR", str(tmp_path))
    rows = [
        {
            "tenantId": "other",
            "name": "בob",
            "phone": "1",
            "date": "2099-01-01",
            "time": "10:00",
        }
    ]
    (tmp_path / "bookings.json").write_text(json.dumps(rows), encoding="utf-8")
    text = ta._test_broadcast_message("t1", "X")
    assert "בob" not in text
