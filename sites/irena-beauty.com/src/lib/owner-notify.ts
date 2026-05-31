/**
 * Direct owner notifications fired on every new booking.
 *
 * Two channels are supported — configure whichever suits you via .env.local:
 *
 * WhatsApp (via Callmebot — free, no server needed):
 *   1. Send "I allow callmebot to send me messages" to +34 603 21 25 72 on WhatsApp
 *   2. You will receive your API key via WhatsApp
 *   3. Set CALLMEBOT_APIKEY=<your_key> in .env.local
 *      OWNER_WHATSAPP_PHONE is pre-set to 972526780739 (052-678-0739)
 *
 * Telegram (direct message to your own chat):
 *   1. Message @userinfobot on Telegram to get your chat ID
 *   2. Set OWNER_TELEGRAM_CHAT_ID=<your_chat_id> in .env.local
 *      (re-uses the existing TELEGRAM_BOT_TOKEN env var)
 */

function buildMessage(booking: { name: string; phone: string; date: string; time: string }): string {
  return [
    '🔔 הזמנה חדשה!',
    `👤 ${booking.name.trim() || '—'}`,
    `📞 ${booking.phone.trim() || '—'}`,
    `📅 ${booking.date} · ${booking.time}`,
  ].join('\n');
}

async function notifyWhatsApp(text: string): Promise<void> {
  const apiKey = process.env.CALLMEBOT_APIKEY?.trim();
  if (!apiKey) return;

  const phone = (process.env.OWNER_WHATSAPP_PHONE?.trim()) || '972526780739';
  const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodeURIComponent(text)}&apikey=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error('[owner-notify/whatsapp]', res.status, await res.text().catch(() => ''));
  }
}

async function notifyTelegramDirect(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.OWNER_TELEGRAM_CHAT_ID?.trim();
  if (!token || !chatId) return;

  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
  if (!res.ok) {
    console.error('[owner-notify/telegram]', res.status, await res.text().catch(() => ''));
  }
}

export async function notifyOwner(booking: {
  name: string;
  phone: string;
  date: string;
  time: string;
}): Promise<void> {
  const msg = buildMessage(booking);
  await Promise.allSettled([notifyWhatsApp(msg), notifyTelegramDirect(msg)]);
}
