'use client'

import { LOCALES, LOCALE_SHORT, type Locale } from '@/lib/i18n/config'
import { useLocale } from './LocaleProvider'

export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { locale, setLocale } = useLocale()

  return (
    <div
      className={`inline-flex items-center rounded-full border border-border-light overflow-hidden ${className}`}
      role="group"
      aria-label="Language"
    >
      {LOCALES.map((l: Locale) => {
        const active = l === locale
        return (
          <button
            key={l}
            type="button"
            onClick={() => setLocale(l)}
            aria-pressed={active}
            className={`px-[10px] py-[5px] text-[12px] font-semibold leading-none transition-colors ${
              active
                ? 'bg-primary-background text-text-white'
                : 'bg-transparent text-text-primary hover:bg-secondary-background'
            }`}
            style={{ fontFamily: 'Nunito Sans' }}
          >
            {LOCALE_SHORT[l]}
          </button>
        )
      })}
    </div>
  )
}
