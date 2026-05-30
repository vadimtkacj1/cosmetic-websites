'use client'

import { LOCALES, LOCALE_SHORT, type Locale } from '@/lib/i18n/config'
import { useAdminI18n } from './AdminLocaleProvider'

export default function AdminLanguageSwitcher() {
  const { locale, setLocale } = useAdminI18n()

  return (
    <div
      style={{ display: 'inline-flex', borderRadius: 8, overflow: 'hidden', border: '1px solid #e5e7eb' }}
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
            style={{
              padding: '5px 10px',
              fontSize: 12,
              fontWeight: 700,
              lineHeight: 1,
              border: 'none',
              cursor: 'pointer',
              background: active ? 'linear-gradient(92.63deg,#1B1BB3 14.57%,#530FAD 99.27%)' : '#fff',
              color: active ? '#fff' : '#6b7280',
            }}
          >
            {LOCALE_SHORT[l]}
          </button>
        )
      })}
    </div>
  )
}
