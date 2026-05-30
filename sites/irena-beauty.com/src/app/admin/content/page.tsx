'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import AdminHeader from '@/components/admin/AdminHeader'
import { useAdminI18n } from '@/components/i18n/AdminLocaleProvider'
import { flatten, type Flat } from '@/lib/i18n/flatten'
import { LOCALES, type Locale } from '@/lib/i18n/config'

const gradient = 'linear-gradient(92.63deg, #1B1BB3 14.57%, #530FAD 99.27%)'

const SECTION_LABELS: Record<string, { ru: string; he: string }> = {
  nav: { ru: 'Меню', he: 'תפריט' },
  actions: { ru: 'Кнопки', he: 'כפתורים' },
  hero: { ru: 'Главный экран', he: 'מסך ראשי' },
  about: { ru: 'Обо мне', he: 'עליי' },
  why: { ru: 'Почему выбирают меня', he: 'למה בוחרות בי' },
  promos: { ru: 'Акции', he: 'מבצעים' },
  portfolio: { ru: 'Портфолио', he: 'תיק עבודות' },
  pricing: { ru: 'Цены', he: 'מחירים' },
  masters: { ru: 'Мастер', he: 'המומחית' },
  testimonials: { ru: 'Отзывы', he: 'המלצות' },
  contact: { ru: 'Контакты', he: 'צור קשר' },
  footer: { ru: 'Подвал', he: 'כותרת תחתונה' },
  booking: { ru: 'Форма записи', he: 'טופס תורים' },
  business: { ru: 'Контактные данные', he: 'פרטי קשר' },
}

type Maps = Record<Locale, Flat>

export default function AdminContentPage() {
  const { t, locale, dir } = useAdminI18n()
  const tc = t.content
  const [maps, setMaps] = useState<Maps | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/site-content', { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        const next = {} as Maps
        for (const l of LOCALES) next[l] = flatten(data[l])
        setMaps(next)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  // Group keys by their first path segment, preserving definition order.
  const sections = useMemo(() => {
    if (!maps) return []
    const keys = Object.keys(maps.ru)
    const groups: { section: string; keys: string[] }[] = []
    const index = new Map<string, number>()
    for (const key of keys) {
      const section = key.split('.')[0]
      if (!index.has(section)) {
        index.set(section, groups.length)
        groups.push({ section, keys: [] })
      }
      groups[index.get(section)!].keys.push(key)
    }
    return groups
  }, [maps])

  const setValue = (l: Locale, key: string, value: string) => {
    setMaps((prev) => (prev ? { ...prev, [l]: { ...prev[l], [key]: value } } : prev))
  }

  const save = async () => {
    if (!maps) return
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch('/api/admin/site-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(maps),
      })
      if (!res.ok) {
        setMessage({ type: 'err', text: tc.error })
        return
      }
      setMessage({ type: 'ok', text: tc.saved })
      setTimeout(() => setMessage(null), 2500)
    } catch {
      setMessage({ type: 'err', text: tc.error })
    } finally {
      setSaving(false)
    }
  }

  if (loading || !maps) {
    return (
      <div>
        <AdminHeader title={tc.title} />
        <div className="p-8 text-center text-[#9ca3af] text-[14px]">{t.common.loading}</div>
      </div>
    )
  }

  const sectionLabel = (section: string) =>
    SECTION_LABELS[section]?.[locale] ?? section

  const fieldLabel = (key: string) => key.split('.').slice(1).join(' · ')

  return (
    <div className="min-w-0 max-w-full" dir={dir}>
      <AdminHeader title={tc.title} subtitle={tc.subtitle} />

      <div className="p-4 md:p-8 max-w-[1100px]">
        <p className="text-[14px] text-[#64748b] mb-6">{tc.intro}</p>

        <div className="flex flex-col gap-6">
          {sections.map(({ section, keys }) => (
            <div key={section} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/60">
                <h2 className="text-[15px] font-bold text-[#111827]">{sectionLabel(section)}</h2>
              </div>
              <div className="p-4 md:p-5 flex flex-col gap-5">
                {keys.map((key) => {
                  const ruVal = maps.ru[key] ?? ''
                  const heVal = maps.he[key] ?? ''
                  const multiline = ruVal.length > 60 || heVal.length > 60 || ruVal.includes('\n')
                  return (
                    <div key={key}>
                      <label className="block text-[12px] font-medium text-[#6b7280] mb-1.5 font-mono break-all">
                        {fieldLabel(key)}
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Field
                          languageLabel={tc.ruColumn}
                          inputDir="ltr"
                          multiline={multiline}
                          value={ruVal}
                          onChange={(v) => setValue('ru', key, v)}
                          disabled={saving}
                        />
                        <Field
                          languageLabel={tc.heColumn}
                          inputDir="rtl"
                          multiline={multiline}
                          value={heVal}
                          onChange={(v) => setValue('he', key, v)}
                          disabled={saving}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="sticky bottom-0 mt-6 py-4 bg-[#f5f5f5] flex items-center gap-3">
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-white text-[14px] font-bold hover:opacity-90 transition-all disabled:opacity-60"
            style={{ background: gradient }}
          >
            {saving ? t.common.saving : t.common.saveChanges}
          </button>
          {message && (
            <span className={`text-[13px] ${message.type === 'ok' ? 'text-emerald-600' : 'text-red-600'}`}>
              {message.text}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function Field({
  languageLabel,
  inputDir,
  multiline,
  value,
  onChange,
  disabled,
}: {
  languageLabel: string
  inputDir: 'ltr' | 'rtl'
  multiline: boolean
  value: string
  onChange: (v: string) => void
  disabled: boolean
}) {
  const base =
    'w-full px-3 py-2 border border-[#d9d9d9] rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#1B1BB3]/20 focus:border-[#1B1BB3] bg-white'
  return (
    <div>
      <span className="block text-[11px] text-[#9ca3af] mb-1">{languageLabel}</span>
      {multiline ? (
        <textarea
          dir={inputDir}
          rows={3}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className={`${base} resize-y min-h-[64px]`}
          style={{ textAlign: inputDir === 'rtl' ? 'right' : 'left' }}
        />
      ) : (
        <input
          dir={inputDir}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className={base}
          style={{ textAlign: inputDir === 'rtl' ? 'right' : 'left' }}
        />
      )}
    </div>
  )
}
