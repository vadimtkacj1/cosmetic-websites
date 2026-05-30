'use client'

import { useEffect, useState, useCallback } from 'react'
import AdminHeader from '@/components/admin/AdminHeader'
import { useAdminI18n } from '@/components/i18n/AdminLocaleProvider'

interface DaySlots {
  enabled: boolean
  slots: string[]
}

type WeekSchedule = Record<number, DaySlots>

const ALL_SLOTS = [
  '08:00','08:30','09:00','09:30','10:00','10:30',
  '11:00','11:30','12:00','12:30','13:00','13:30',
  '14:00','14:30','15:00','15:30','16:00','16:30',
  '17:00','17:30','18:00','18:30','19:00',
]

const gradient = 'linear-gradient(92.63deg, #1B1BB3 14.57%, #530FAD 99.27%)'

export default function SlotsPage() {
  const { t } = useAdminI18n()
  const ts = t.slots
  const [schedule, setSchedule] = useState<WeekSchedule | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const fetchSchedule = useCallback(async () => {
    const res = await fetch('/api/admin/slots')
    if (res.ok) {
      const data = await res.json() as { schedule: WeekSchedule }
      setSchedule(data.schedule)
    }
  }, [])

  useEffect(() => { fetchSchedule() }, [fetchSchedule])

  const toggleDay = (day: number) => {
    setSchedule((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        [day]: { ...prev[day], enabled: !prev[day].enabled },
      }
    })
  }

  const toggleSlot = (day: number, slot: string) => {
    setSchedule((prev) => {
      if (!prev) return prev
      const current = prev[day].slots
      const next = current.includes(slot)
        ? current.filter((s) => s !== slot)
        : [...current, slot].sort()
      return { ...prev, [day]: { ...prev[day], slots: next } }
    })
  }

  const handleSave = async () => {
    if (!schedule) return
    setSaving(true)
    try {
      await fetch('/api/admin/slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schedule }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } finally {
      setSaving(false)
    }
  }

  if (!schedule) {
    return (
      <div>
        <AdminHeader title={ts.title} />
        <div className="p-8 text-center text-[#9ca3af] text-[14px]">{t.common.loading}</div>
      </div>
    )
  }

  return (
    <div className="min-w-0 max-w-full">
      <AdminHeader title={ts.title} subtitle={ts.subtitle} />

      <div className="p-4 md:p-8 min-w-0 max-w-full">
        <div className="flex flex-col gap-4">
          {[0, 1, 2, 3, 4, 5, 6].map((day) => {
            const dayData = schedule[day]
            return (
              <div
                key={day}
                className="bg-white rounded-xl border border-gray-100 shadow-sm min-w-0 max-w-full"
              >
                {/* Day header */}
                <div
                  className="flex items-center justify-between px-5 py-4 cursor-pointer select-none"
                  onClick={() => toggleDay(day)}
                >
                  <div className="flex items-center gap-3">
                    {/* Toggle switch */}
                    <div
                      style={{
                        width: 40,
                        height: 22,
                        borderRadius: 11,
                        background: dayData.enabled
                          ? gradient
                          : '#e5e7eb',
                        position: 'relative',
                        transition: 'background 0.2s',
                        flexShrink: 0,
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          top: 3,
                          right: dayData.enabled ? 3 : undefined,
                          left: dayData.enabled ? undefined : 3,
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          background: '#fff',
                          transition: 'all 0.2s',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: 15,
                        fontWeight: 600,
                        color: dayData.enabled ? '#111827' : '#9ca3af',
                      }}
                    >
                      {ts.dayPrefix ? `${ts.dayPrefix} ` : ''}{ts.dayNames[day]}
                    </span>
                  </div>
                  <span className="text-[13px] text-[#9ca3af]">
                    {dayData.enabled
                      ? `${dayData.slots.length} ${ts.hoursSuffix}`
                      : ts.closed}
                  </span>
                </div>

                {/* Slots grid */}
                {dayData.enabled && (
                  <div
                    className="px-5 pb-4 border-t border-gray-50 min-w-0 overflow-x-auto overscroll-x-contain"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex flex-wrap gap-2 pt-3 min-w-0">
                      {ALL_SLOTS.map((slot) => {
                        const active = dayData.slots.includes(slot)
                        return (
                          <button
                            key={slot}
                            onClick={() => toggleSlot(day, slot)}
                            style={active ? {
                              background: gradient,
                              color: '#fff',
                              border: '1px solid transparent',
                            } : {
                              background: '#fff',
                              color: '#6b7280',
                              border: '1px solid #e5e7eb',
                            }}
                            className="px-3 py-1.5 text-[13px] font-medium rounded-lg transition-all hover:opacity-80"
                          >
                            {slot}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Save button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={handleSave}
            disabled={saving}
            style={{ background: saved ? '#16a34a' : gradient }}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-white text-[14px] font-bold hover:opacity-90 transition-all disabled:opacity-60"
          >
            {saving
              ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> {t.common.saving}</>
              : saved
              ? ts.savedOk
              : t.common.saveChanges
            }
          </button>
        </div>
      </div>
    </div>
  )
}
