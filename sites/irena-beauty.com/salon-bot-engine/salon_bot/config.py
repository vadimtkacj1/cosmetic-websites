from __future__ import annotations

import os
from dataclasses import dataclass

from dotenv import load_dotenv


@dataclass(frozen=True, slots=True)
class Settings:
    telegram_bot_token: str
    greenapi_url: str
    greenapi_id_instance: str
    greenapi_token: str
    ignore_whatsapp_groups: bool

    @classmethod
    def from_env(cls) -> Settings:
        load_dotenv()
        return cls(
            telegram_bot_token=os.getenv("TELEGRAM_BOT_TOKEN", "").strip(),
            greenapi_url=os.getenv("GREENAPI_URL", "https://api.green-api.com").strip(),
            greenapi_id_instance=os.getenv("GREENAPI_ID_INSTANCE", "").strip(),
            greenapi_token=os.getenv("GREENAPI_TOKEN", "").strip(),
            ignore_whatsapp_groups=os.getenv("IGNORE_WA_GROUPS", "true").lower()
            in ("1", "true", "yes"),
        )
