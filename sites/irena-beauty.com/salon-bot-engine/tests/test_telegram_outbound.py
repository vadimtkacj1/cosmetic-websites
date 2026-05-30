from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock

import pytest
from telegram.error import Forbidden

from salon_bot.telegram_outbound import (
    attach_outbound_worker,
    detach_outbound_worker,
    queue_telegram_messages,
)


@pytest.fixture
def mock_app():
    app = MagicMock()
    app.bot_data = {}
    app.bot = MagicMock()
    app.bot.send_message = AsyncMock(return_value=None)
    return app


@pytest.mark.asyncio
async def test_queue_telegram_messages_all_ok(mock_app, monkeypatch):
    monkeypatch.setenv("TELEGRAM_SEND_MIN_INTERVAL_SEC", "0.02")
    await attach_outbound_worker(mock_app)
    try:
        ok, err = await queue_telegram_messages(
            mock_app, [("111", "hello"), ("222", "world")]
        )
        assert ok == 2
        assert err == 0
        assert mock_app.bot.send_message.await_count == 2
    finally:
        await detach_outbound_worker(mock_app)


@pytest.mark.asyncio
async def test_queue_telegram_messages_counts_forbidden(mock_app, monkeypatch):
    monkeypatch.setenv("TELEGRAM_SEND_MIN_INTERVAL_SEC", "0.02")
    mock_app.bot.send_message = AsyncMock(side_effect=Forbidden("blocked"))
    await attach_outbound_worker(mock_app)
    try:
        ok, err = await queue_telegram_messages(mock_app, [("1", "a"), ("2", "b")])
        assert ok == 0
        assert err == 2
    finally:
        await detach_outbound_worker(mock_app)


@pytest.mark.asyncio
async def test_queue_telegram_messages_empty_returns_zero(mock_app):
    ok, err = await queue_telegram_messages(mock_app, [])
    assert ok == 0
    assert err == 0


@pytest.mark.asyncio
async def test_queue_requires_initialized_worker(mock_app):
    with pytest.raises(RuntimeError, match="outbound queue not initialized"):
        await queue_telegram_messages(mock_app, [("1", "x")])


def test_chat_id_int_vs_string(monkeypatch):
    monkeypatch.delenv("TELEGRAM_SEND_MIN_INTERVAL_SEC", raising=False)
    from salon_bot.telegram_outbound import _chat_id_arg

    assert _chat_id_arg("12345") == 12345
    assert _chat_id_arg("-100123") == -100123
    assert _chat_id_arg("@channel") == "@channel"
