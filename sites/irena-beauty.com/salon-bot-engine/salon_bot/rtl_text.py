"""RTL helper for messenger clients (Telegram/WhatsApp often default paragraph direction to LTR)."""

from __future__ import annotations

# Unicode RIGHT-TO-LEFT MARK — sets base direction for the following text.
_RLM = "\u200f"


def rtl(s: str) -> str:
    if not s:
        return s
    return _RLM + s
