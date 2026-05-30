import fs from 'fs'
import path from 'path'
import { getSalonDataDir } from '@/lib/salon-data-dir'

const SETTINGS_FILE = path.join(getSalonDataDir(), 'notification-settings.json')

export type NotificationMode = 'scheduled' | 'instant'

export interface NotificationSettings {
  enabled: boolean
  /** scheduled = daily digest at timeLocal + end-of-day catch-up; instant = Telegram after each new booking */
  mode: NotificationMode
  /** Local time HH:mm — used when mode === 'scheduled' */
  timeLocal: string
  /** IANA timezone (not shown in minimal admin UI; set via env or existing file) */
  timezone: string
}

export const NOTIFICATION_DEFAULTS: NotificationSettings = {
  enabled: true,
  mode: 'scheduled',
  timeLocal: '20:00',
  timezone: 'Asia/Jerusalem',
}

export function isValidIanaTimeZone(tz: string): boolean {
  const t = tz.trim()
  if (!t) return false
  try {
    Intl.DateTimeFormat(undefined, { timeZone: t })
    return true
  } catch {
    return false
  }
}

export function normalizeTimeLocal(raw: string): string | null {
  const s = raw.trim().replace('.', ':')
  const m = s.match(/^(\d{1,2}):(\d{2})$/)
  if (!m) return null
  const h = Math.min(23, Math.max(0, parseInt(m[1], 10)))
  const min = Math.min(59, Math.max(0, parseInt(m[2], 10)))
  if (Number.isNaN(h) || Number.isNaN(min)) return null
  return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`
}

function parseMode(raw: string | undefined): NotificationMode {
  const v = (raw || '').trim().toLowerCase()
  if (v === 'instant') return 'instant'
  return 'scheduled'
}

/** Matches bot env when notification-settings.json is absent. */
function effectiveFromEnv(): NotificationSettings {
  const v = (process.env.SALON_DAILY_REMINDER_ENABLE || '1').trim().toLowerCase()
  const enabled = v === '1' || v === 'true' || v === 'yes' || v === 'on'
  const mode = parseMode(process.env.SALON_NOTIFICATION_MODE)
  const timeLocal =
    normalizeTimeLocal(process.env.SALON_DAILY_REMINDER_TIME || NOTIFICATION_DEFAULTS.timeLocal) ??
    NOTIFICATION_DEFAULTS.timeLocal
  const tzRaw = (process.env.SALON_TIMEZONE || '').trim()
  const timezone = isValidIanaTimeZone(tzRaw) ? tzRaw : NOTIFICATION_DEFAULTS.timezone
  return { enabled, mode, timeLocal, timezone }
}

function normalizeMode(raw: unknown, fb: NotificationMode): NotificationMode {
  if (raw === 'instant' || raw === 'scheduled') return raw
  if (typeof raw === 'string') return parseMode(raw)
  return fb
}

export function readNotificationSettings(): NotificationSettings {
  if (!fs.existsSync(SETTINGS_FILE)) {
    return effectiveFromEnv()
  }
  try {
    const raw = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8')) as Partial<NotificationSettings>
    const fb = effectiveFromEnv()
    const timeLocal = normalizeTimeLocal(
      raw.timeLocal !== undefined ? String(raw.timeLocal) : fb.timeLocal,
    )
    const timezoneRaw = String(raw.timezone ?? fb.timezone).trim()
    return {
      enabled: typeof raw.enabled === 'boolean' ? raw.enabled : fb.enabled,
      mode: normalizeMode(raw.mode, fb.mode),
      timeLocal: timeLocal ?? fb.timeLocal,
      timezone: isValidIanaTimeZone(timezoneRaw) ? timezoneRaw : fb.timezone,
    }
  } catch {
    return effectiveFromEnv()
  }
}

export function writeNotificationSettings(next: NotificationSettings): void {
  fs.mkdirSync(path.dirname(SETTINGS_FILE), { recursive: true })
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(next, null, 2), 'utf-8')
}

export function patchNotificationSettings(
  patch: Partial<
    Pick<NotificationSettings, 'enabled' | 'mode' | 'timeLocal' | 'timezone'>
  >,
): { ok: true; settings: NotificationSettings } | { ok: false; error: string } {
  const cur = readNotificationSettings()
  let enabled = cur.enabled
  let mode = cur.mode
  let timeLocal = cur.timeLocal
  let timezone = cur.timezone

  if (patch.enabled !== undefined) {
    enabled = Boolean(patch.enabled)
  }
  if (patch.mode !== undefined) {
    mode = patch.mode === 'instant' ? 'instant' : 'scheduled'
  }
  if (patch.timeLocal !== undefined) {
    const n = normalizeTimeLocal(patch.timeLocal)
    if (!n) return { ok: false, error: 'פורמט שעה לא תקין (נדרש HH:mm)' }
    timeLocal = n
  }
  if (patch.timezone !== undefined) {
    const tz = String(patch.timezone).trim()
    if (!isValidIanaTimeZone(tz)) return { ok: false, error: 'אזור זמן לא תקין' }
    timezone = tz
  }

  const settings: NotificationSettings = { enabled, mode, timeLocal, timezone }
  writeNotificationSettings(settings)
  return { ok: true, settings }
}
