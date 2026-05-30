'use client'

import { useCallback, useEffect, useState } from 'react'
import AdminHeader from '@/components/admin/AdminHeader'
import type { NotificationSettings } from '@/lib/notification-settings-store'
import { useAdminI18n } from '@/components/i18n/AdminLocaleProvider'

const gradient = 'linear-gradient(92.63deg, #1B1BB3 14.57%, #530FAD 99.27%)'

export default function AdminNotificationsPage() {
  const { t } = useAdminI18n()
  const tn = t.notifications
  const [settings, setSettings] = useState<NotificationSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/notification-settings', { cache: 'no-store' })
      if (res.ok) setSettings(await res.json())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const saveAll = async () => {
    if (!settings) return
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch('/api/admin/notification-settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enabled: settings.enabled,
          mode: settings.mode,
          timeLocal: settings.timeLocal,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setMessage({ type: 'err', text: data.error || tn.error })
        return
      }
      setSettings(data)
      setMessage({ type: 'ok', text: tn.saved })
      setTimeout(() => setMessage(null), 2000)
    } finally {
      setSaving(false)
    }
  }

  if (loading || !settings) {
    return (
      <div>
        <AdminHeader title={tn.title} />
        <div className="p-8 text-center text-[#9ca3af] text-[14px]">{t.common.loading}</div>
      </div>
    )
  }

  return (
    <div className="min-w-0 max-w-full">
      <AdminHeader title={tn.title} />

      <div className="p-4 md:p-8 max-w-[480px]">
        <h1 className="text-[18px] font-semibold text-[#0f172a] mb-5">{tn.title}</h1>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-5">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.enabled}
              disabled={saving}
              onChange={(e) => setSettings((s) => (s ? { ...s, enabled: e.target.checked } : s))}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-[14px] font-medium text-[#334155]">{tn.active}</span>
          </label>

          <div className="space-y-2">
            <span className="text-[13px] font-medium text-[#475569]">{tn.sendMode}</span>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="mode"
                checked={settings.mode === 'scheduled'}
                disabled={saving}
                onChange={() => setSettings((s) => (s ? { ...s, mode: 'scheduled' } : s))}
              />
              <span className="text-[14px] text-[#334155]">{tn.scheduled}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="mode"
                checked={settings.mode === 'instant'}
                disabled={saving}
                onChange={() => setSettings((s) => (s ? { ...s, mode: 'instant' } : s))}
              />
              <span className="text-[14px] text-[#334155]">{tn.instant}</span>
            </label>
          </div>

          {settings.mode === 'scheduled' && (
            <div>
              <label className="block text-[13px] font-medium text-[#475569] mb-2">{tn.timeLabel}</label>
              <input
                type="time"
                value={settings.timeLocal}
                disabled={saving}
                onChange={(e) => setSettings((s) => (s ? { ...s, timeLocal: e.target.value } : s))}
                className="border border-gray-200 rounded-lg px-3 py-2 text-[15px] font-mono"
              />
            </div>
          )}

          <button
            type="button"
            disabled={saving}
            onClick={() => void saveAll()}
            className="w-full py-2.5 rounded-lg text-[14px] font-semibold text-white hover:opacity-90 disabled:opacity-50"
            style={{ background: gradient }}
          >
            {saving ? t.common.saving : t.common.save}
          </button>

          {message && (
            <p
              className={`text-[13px] ${message.type === 'ok' ? 'text-emerald-600' : 'text-red-600'}`}
            >
              {message.text}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
