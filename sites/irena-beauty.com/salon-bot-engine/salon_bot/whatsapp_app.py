from __future__ import annotations

import logging
import time

from salon_bot.green_api_min import GreenApiMini, extract_incoming_text
from salon_bot.tenants_store import HINT_HE, try_subscribe

logger = logging.getLogger(__name__)


def run_whatsapp_bot(
    api: GreenApiMini,
    *,
    own_wid: str = "",
    ignore_groups: bool = True,
) -> None:
    logger.info("Salon WhatsApp (Green API) polling. Ctrl+C to stop.")
    while True:
        try:
            notification = api.get_notification()
            if not notification:
                continue
            receipt_id = int(notification.get("receiptId") or 0)
            try:
                body = notification.get("body")
                if not isinstance(body, dict):
                    continue
                if body.get("typeWebhook") != "incomingMessageReceived":
                    continue
                chat_id, sender, text = extract_incoming_text(body)
                if not chat_id or not text:
                    continue
                if ignore_groups and chat_id.endswith("@g.us"):
                    continue
                if own_wid and sender == own_wid:
                    continue

                ack = try_subscribe("whatsapp", chat_id, text, username=None)
                if ack:
                    api.send_message(chat_id, ack)
                elif len("".join(text.split())) <= 16:
                    api.send_message(chat_id, HINT_HE)
            finally:
                if receipt_id:
                    api.delete_notification(receipt_id)
        except KeyboardInterrupt:
            logger.info("WhatsApp bot stopped.")
            break
        except Exception:
            logger.exception("whatsapp loop error; sleep 5s")
            time.sleep(5)
