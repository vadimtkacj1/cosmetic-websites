from __future__ import annotations

import logging
import time
from typing import Any

import requests

logger = logging.getLogger(__name__)
HTTP_TIMEOUT = 60
RECEIPT_TIMEOUT = 60


class GreenApiMini:
    def __init__(self, base_url: str, id_instance: str, api_token: str) -> None:
        self._base = base_url.rstrip("/")
        self._id = id_instance
        self._token = api_token

    def _url(self, method: str) -> str:
        return f"{self._base}/waInstance{self._id}/{method}/{self._token}"

    def get_notification(self) -> dict[str, Any] | None:
        try:
            r = requests.get(
                self._url("receiveNotification"),
                params={"receiptTimeout": RECEIPT_TIMEOUT},
                timeout=HTTP_TIMEOUT,
            )
            if r.status_code != 200:
                return None
            data = r.json()
            if not isinstance(data, dict) or "receiptId" not in data:
                return None
            return data
        except requests.RequestException as exc:
            logger.debug("receiveNotification: %s", exc)
            time.sleep(2.0)
            return None

    def delete_notification(self, receipt_id: int) -> None:
        url = f"{self._base}/waInstance{self._id}/deleteNotification/{self._token}/{receipt_id}"
        try:
            requests.delete(url, timeout=15)
        except Exception as exc:
            logger.warning("deleteNotification %s: %s", receipt_id, exc)

    def send_message(self, chat_id: str, text: str) -> None:
        try:
            r = requests.post(
                self._url("sendMessage"),
                json={"chatId": chat_id, "message": text},
                timeout=30,
            )
            if r.status_code != 200:
                logger.error("sendMessage %s HTTP %s %s", chat_id, r.status_code, r.text[:200])
        except Exception as exc:
            logger.exception("sendMessage %s: %s", chat_id, exc)


def extract_incoming_text(body: dict[str, Any]) -> tuple[str | None, str | None, str | None]:
    sender_data = body.get("senderData") or {}
    chat_id = str(sender_data.get("chatId") or "")
    sender = str(sender_data.get("sender") or "")
    msg_data = body.get("messageData") or {}
    msg_type = str(msg_data.get("typeMessage") or "")
    if msg_type == "textMessage":
        t = (msg_data.get("textMessageData") or {}).get("textMessage")
        return chat_id, sender, str(t).strip() if t else None
    if msg_type == "extendedTextMessage":
        t = (msg_data.get("extendedTextMessageData") or {}).get("text")
        return chat_id, sender, str(t).strip() if t else None
    return chat_id, sender, None
