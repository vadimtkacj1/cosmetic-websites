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
from salon_bot.green_api_min import GreenApiMini  # noqa: E402
from salon_bot.whatsapp_app import run_whatsapp_bot  # noqa: E402


def main() -> None:
    s = Settings.from_env()
    if not s.greenapi_id_instance or not s.greenapi_token:
        raise SystemExit(
            "GREENAPI_ID_INSTANCE and GREENAPI_TOKEN in .env. Optional: GREENAPI_URL, SALON_DATA_DIR."
        )
    api = GreenApiMini(s.greenapi_url, s.greenapi_id_instance, s.greenapi_token)
    run_whatsapp_bot(api, ignore_groups=s.ignore_whatsapp_groups)


if __name__ == "__main__":
    main()
