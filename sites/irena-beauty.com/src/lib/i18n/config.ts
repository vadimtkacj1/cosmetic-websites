export const LOCALES = ['ru', 'he'] as const
export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'ru'
export const RTL_LOCALES: readonly Locale[] = ['he']
export const LOCALE_COOKIE = 'locale'

export const LOCALE_LABELS: Record<Locale, string> = {
  ru: 'Русский',
  he: 'עברית',
}

/** Short label for compact switchers. */
export const LOCALE_SHORT: Record<Locale, string> = {
  ru: 'RU',
  he: 'עב',
}

export function isRtl(locale: Locale): boolean {
  return RTL_LOCALES.includes(locale)
}

export function dirFor(locale: Locale): 'rtl' | 'ltr' {
  return isRtl(locale) ? 'rtl' : 'ltr'
}

export function normalizeLocale(value: string | undefined | null): Locale {
  return LOCALES.includes(value as Locale) ? (value as Locale) : DEFAULT_LOCALE
}

/** Read the locale from a `document.cookie` string (client-side). */
export function localeFromCookieString(cookieStr: string): Locale {
  const match = cookieStr.match(new RegExp(`(?:^|; )${LOCALE_COOKIE}=([^;]+)`))
  return normalizeLocale(match ? decodeURIComponent(match[1]) : null)
}
