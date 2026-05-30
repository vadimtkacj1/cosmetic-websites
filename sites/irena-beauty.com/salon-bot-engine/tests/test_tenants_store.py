from __future__ import annotations

import json

import pytest

from salon_bot.tenants_store import (
    bookings_for_test_broadcast,
    _normalize_code,
    try_subscribe,
)


def test_normalize_code():
    assert _normalize_code("  ab cd  ") == "ABCD"
    assert _normalize_code("") == ""


def test_bookings_for_test_broadcast_upcoming(monkeypatch, tmp_path):
    monkeypatch.setenv("SALON_DATA_DIR", str(tmp_path))
    data = [
        {"tenantId": "x", "date": "2099-12-01", "time": "09:00", "name": "N", "phone": "p"}
    ]
    (tmp_path / "bookings.json").write_text(json.dumps(data), encoding="utf-8")
    rows, kind = bookings_for_test_broadcast("x", limit=5)
    assert kind == "upcoming"
    assert len(rows) == 1
    assert rows[0]["name"] == "N"


def test_bookings_for_test_broadcast_recent_when_no_future(monkeypatch, tmp_path):
    monkeypatch.setenv("SALON_DATA_DIR", str(tmp_path))
    data = [
        {"tenantId": "x", "date": "2020-01-01", "time": "09:00", "name": "Past", "phone": "1"}
    ]
    (tmp_path / "bookings.json").write_text(json.dumps(data), encoding="utf-8")
    rows, kind = bookings_for_test_broadcast("x", limit=5)
    assert kind == "recent"
    assert rows[0]["name"] == "Past"


def test_try_subscribe_new_user(monkeypatch, tmp_path):
    monkeypatch.setenv("SALON_DATA_DIR", str(tmp_path))
    tenants = {
        "version": 1,
        "tenants": {
            "t1": {
                "label": "L",
                "subscribeCode": "ABC123",
                "telegram": [],
                "whatsapp": [],
            }
        },
    }
    (tmp_path / "messenger-tenants.json").write_text(
        json.dumps(tenants, ensure_ascii=False), encoding="utf-8"
    )
    ack = try_subscribe("telegram", "999888", "  abc123  ", username="u1")
    assert ack is not None
    assert "נרשמתם" in ack or "הרשמה" in ack

    data = json.loads((tmp_path / "messenger-tenants.json").read_text(encoding="utf-8"))
    tg = data["tenants"]["t1"]["telegram"]
    assert len(tg) == 1
    assert tg[0]["chatId"] == "999888"


def test_try_subscribe_wrong_code(monkeypatch, tmp_path):
    monkeypatch.setenv("SALON_DATA_DIR", str(tmp_path))
    tenants = {
        "version": 1,
        "tenants": {
            "t1": {
                "label": "L",
                "subscribeCode": "ZZZ",
                "telegram": [],
                "whatsapp": [],
            }
        },
    }
    (tmp_path / "messenger-tenants.json").write_text(json.dumps(tenants), encoding="utf-8")
    assert try_subscribe("telegram", "1", "wrong") is None
