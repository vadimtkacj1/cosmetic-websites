import { readNotificationSettings } from '@/lib/notification-settings-store'
import { listTelegramChatIdsForTenant } from '@/lib/messenger-broadcast-store'

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

function formatInstantBookingHe(booking: {
  name: string
  phone: string
  date: string
  time: string
}): string {
  const nm = booking.name.trim() || '—'
  const ph = booking.phone.trim() || '—'
  return ['הוזמנה חדשה', '', `• ${nm} · ${booking.date} · ${booking.time} · ${ph}`].join('\n')
}

/**
 * When mode is `instant`, notify all Telegram subscribers for this tenant via Bot API.
 * Non-blocking for callers — await inside fire-and-forget is optional.
 */
export async function notifyTelegramInstantBooking(booking: {
  tenantId: string
  name: string
  phone: string
  date: string
  time: string
}): Promise<void> {
  try {
    const settings = readNotificationSettings()
    if (!settings.enabled || settings.mode !== 'instant') return

    const token = process.env.TELEGRAM_BOT_TOKEN?.trim()
    if (!token) return

    const chatIds = listTelegramChatIdsForTenant(booking.tenantId)
    if (!chatIds.length) return

    const text = formatInstantBookingHe(booking)
    const url = `https://api.telegram.org/bot${token}/sendMessage`

    for (const chatId of chatIds) {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text }),
      })
      if (!res.ok) {
        const err = await res.text().catch(() => '')
        console.error('[telegram-instant]', res.status, err.slice(0, 200))
      }
      await sleep(80)
    }
  } catch (e) {
    console.error('[telegram-instant]', e)
  }
}
