#!/usr/bin/env python3
from __future__ import annotations

import logging
import sys
from pathlib import Path

_ROOT = Path(__file__).resolve().parent
if str(_ROOT) not in sys.path:
    sys.path.insert(0, str(_ROOT))

logging.basicConfig(
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
    level=logging.INFO,
)

from salon_bot.config import Settings  # noqa: E402
from salon_bot.telegram_app import run_telegram_bot  # noqa: E402


def main() -> None:
    s = Settings.from_env()
    if not s.telegram_bot_token:
        raise SystemExit(
            "TELEGRAM_BOT_TOKEN in .env (from @BotFather). Optional: SALON_DATA_DIR or SALON_TENANTS_JSON."
        )
    run_telegram_bot(s.telegram_bot_token)


if __name__ == "__main__":
    main()
