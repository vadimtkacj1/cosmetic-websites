'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  DEFAULT_LOCALE,
  dirFor,
  localeFromCookieString,
  LOCALE_COOKIE,
  type Locale,
} from '@/lib/i18n/config'
import { ADMIN_STRINGS, type AdminStrings } from '@/lib/i18n/admin-strings'

interface AdminLocaleContextValue {
  locale: Locale
  setLocale: (next: Locale) => void
  dir: 'rtl' | 'ltr'
  t: AdminStrings
}

const AdminLocaleContext = createContext<AdminLocaleContextValue | null>(null)

export function AdminLocaleProvider({ children }: { children: React.ReactNode }) {
  // Start from the server default to keep SSR/CSR markup consistent, then sync to
  // the cookie on mount (the admin layout is a client component, so there is no
  // server-provided initial locale here).
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE)

  useEffect(() => {
    const fromCookie = localeFromCookieString(document.cookie)
    setLocaleState(fromCookie)
    document.documentElement.lang = fromCookie
    document.documentElement.dir = dirFor(fromCookie)
  }, [])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`
    document.documentElement.lang = next
    document.documentElement.dir = dirFor(next)
  }, [])

  const value = useMemo<AdminLocaleContextValue>(
    () => ({ locale, setLocale, dir: dirFor(locale), t: ADMIN_STRINGS[locale] }),
    [locale, setLocale],
  )

  return <AdminLocaleContext.Provider value={value}>{children}</AdminLocaleContext.Provider>
}

export function useAdminI18n(): AdminLocaleContextValue {
  const ctx = useContext(AdminLocaleContext)
  if (!ctx) throw new Error('useAdminI18n must be used within <AdminLocaleProvider>')
  return ctx
}
