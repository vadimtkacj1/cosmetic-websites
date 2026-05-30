'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { dirFor, LOCALE_COOKIE, type Locale } from '@/lib/i18n/config'
import type { SiteContent } from '@/lib/i18n/site-content'
import type { ContentByLocale } from '@/lib/site-content-store'

interface LocaleContextValue {
  locale: Locale
  setLocale: (next: Locale) => void
  dir: 'rtl' | 'ltr'
  content: SiteContent
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({
  initialLocale,
  contentByLocale,
  children,
}: {
  initialLocale: Locale
  contentByLocale: ContentByLocale
  children: React.ReactNode
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`
    const dir = dirFor(next)
    document.documentElement.lang = next
    document.documentElement.dir = dir
  }, [])

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale,
      dir: dirFor(locale),
      content: contentByLocale[locale],
    }),
    [locale, setLocale, contentByLocale],
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within <LocaleProvider>')
  return ctx
}

export function useSiteContent(): SiteContent {
  return useLocale().content
}
