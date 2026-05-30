'use client'

import type { ReactNode } from 'react'
import { useEffect, useState, useCallback } from 'react'
import AdminHeader from '@/components/admin/AdminHeader'
import { Trash2, Pencil, Check, X } from 'lucide-react'
import { isBookingDateNotInPast, isValidBookingDateString } from '@/lib/booking-date'
import { useAdminI18n } from '@/components/i18n/AdminLocaleProvider'

interface Booking {
  id: string
  name: string
  phone: string
  date: string
  time: string
  createdAt: string
  tenantId?: string
}

const FALLBACK_SLOTS = [
  '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00',
]

function localISODate(d = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function formatDate(dateStr: string, intlLocale: string) {
  const date = new Date(`${dateStr}T00:00:00`)
  return new Intl.DateTimeFormat(intlLocale, {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function formatCreatedAt(iso: string, intlLocale: string) {
  return new Intl.DateTimeFormat(intlLocale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(iso))
}

/** Phone / date / time: force LTR so +972… and ISO dates don’t flip in Hebrew layout */
function LtrField({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span dir="ltr" className={`inline-block w-full text-left tabular-nums ${className}`}>
      {children}
    </span>
  )
}

const gradient = 'linear-gradient(92.63deg, #1B1BB3 14.57%, #530FAD 99.27%)'

export default function BookingsPage() {
  const { t, locale } = useAdminI18n()
  const intlLocale = locale === 'ru' ? 'ru-RU' : 'he-IL'
  const tb = t.bookings
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newDate, setNewDate] = useState(localISODate)
  const [newTime, setNewTime] = useState(FALLBACK_SLOTS[0])
  const [createBusy, setCreateBusy] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  const [timeOptions, setTimeOptions] = useState<string[]>(FALLBACK_SLOTS)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState({ name: '', phone: '', date: '', time: '' })
  const [saveBusy, setSaveBusy] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)

  const slotSourceDate = editingId ? editDraft.date : newDate

  useEffect(() => {
    let cancelled = false
    fetch('/api/public/slots')
      .then((r) => r.json())
      .then((data: { schedule: Record<number, { enabled: boolean; slots: string[] }> }) => {
        if (cancelled) return
        const dayOfWeek = new Date(`${slotSourceDate}T00:00:00`).getDay()
        const day = data.schedule[dayOfWeek]
        const slots =
          day?.enabled && day.slots.length > 0 ? day.slots : FALLBACK_SLOTS
        setTimeOptions(slots)
        if (!editingId) {
          setNewTime((t) => (slots.includes(t) ? t : slots[0]))
        }
      })
      .catch(() => {
        if (!cancelled) setTimeOptions(FALLBACK_SLOTS)
      })
    return () => {
      cancelled = true
    }
  }, [slotSourceDate, editingId])

  const fetchBookings = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/bookings', { cache: 'no-store' })
      if (res.ok) {
        const data = (await res.json()) as { bookings: Booking[] }
        setBookings(data.bookings)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreateError(null)
    if (!newName.trim() || !newPhone.trim() || !newDate || !newTime) return
    if (!isValidBookingDateString(newDate) || !isBookingDateNotInPast(newDate)) {
      setCreateError(tb.errorDatePast)
      return
    }
    setCreateBusy(true)
    try {
      const res = await fetch('/api/admin/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName.trim(),
          phone: newPhone.trim(),
          date: newDate,
          time: newTime,
        }),
      })
      const data = (await res.json().catch(() => ({}))) as { booking?: Booking; error?: string }
      if (!res.ok) {
        setCreateError(typeof data.error === 'string' ? data.error : tb.errorSave)
        return
      }
      if (data.booking) {
        setBookings((prev) => [data.booking!, ...prev])
        setNewName('')
        setNewPhone('')
        setNewDate(localISODate())
      }
    } finally {
      setCreateBusy(false)
    }
  }

  const startEdit = (b: Booking) => {
    setEditError(null)
    setEditingId(b.id)
    const today = localISODate()
    const date =
      isValidBookingDateString(b.date) && isBookingDateNotInPast(b.date) ? b.date : today
    setEditDraft({ name: b.name, phone: b.phone, date, time: b.time })
  }

  const cancelEdit = () => {
    setEditError(null)
    setEditingId(null)
  }

  const handleSaveEdit = async () => {
    if (!editingId) return
    setEditError(null)
    if (!editDraft.name.trim() || !editDraft.phone.trim() || !editDraft.date || !editDraft.time) return
    const existing = bookings.find((b) => b.id === editingId)
    if (
      editDraft.date !== existing?.date &&
      (!isValidBookingDateString(editDraft.date) || !isBookingDateNotInPast(editDraft.date))
    ) {
      setEditError(tb.errorEditDatePast)
      return
    }
    setSaveBusy(true)
    try {
      const res = await fetch('/api/admin/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingId,
          name: editDraft.name.trim(),
          phone: editDraft.phone.trim(),
          date: editDraft.date,
          time: editDraft.time,
        }),
      })
      const data = (await res.json().catch(() => ({}))) as { booking?: Booking; error?: string }
      if (!res.ok) {
        setEditError(typeof data.error === 'string' ? data.error : tb.errorSave)
        return
      }
      if (data.booking) {
        setBookings((prev) => prev.map((b) => (b.id === editingId ? data.booking! : b)))
        setEditingId(null)
      }
    } finally {
      setSaveBusy(false)
    }
  }

  const handleDelete = async (id: string) => {
    const row = bookings.find((b) => b.id === id)
    const detail = row
      ? `${row.name} · ${row.date} · ${row.time}`
      : ''
    const message = detail
      ? `${tb.confirmDeletePrefix}${detail}${tb.confirmDeleteSuffix}`
      : tb.confirmDeleteShort
    if (!window.confirm(message)) return

    setDeleteId(id)
    try {
      await fetch('/api/admin/bookings', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      setBookings((prev) => prev.filter((b) => b.id !== id))
      if (editingId === id) setEditingId(null)
    } finally {
      setDeleteId(null)
    }
  }

  const filtered = bookings.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.phone.includes(search) ||
      b.date.includes(search)
  )

  const editTimeChoices =
    editingId && editDraft.time && !timeOptions.includes(editDraft.time)
      ? [...timeOptions, editDraft.time].sort()
      : timeOptions

  const fieldBase =
    'w-full px-3 py-2 border border-[#d9d9d9] rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#1B1BB3]/20 focus:border-[#1B1BB3] bg-white'
  /** Name: auto direction — Latin (Oleg) LTR, Hebrew RTL */
  const inputName = `${fieldBase} text-start`
  /** Numbers / Latin — isolated LTR inside RTL admin */
  const inputLtr = `${fieldBase} text-left [direction:ltr]`

  return (
    <div>
      <AdminHeader title={tb.title} subtitle={loading ? undefined : `${bookings.length} ${tb.countSuffix}`} />

      <div className="p-4 md:p-8">
        <form
          onSubmit={handleCreate}
          className="mb-8 bg-white rounded-xl border border-gray-100 shadow-sm p-5 md:p-6 space-y-4"
        >
          <h2 className="text-[15px] font-bold text-[#111827]">{tb.newTitle}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-[12px] text-[#6b7280] mb-1">{tb.name}</label>
              <input
                dir="auto"
                autoComplete="name"
                className={inputName}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[12px] text-[#6b7280] mb-1">{tb.phone}</label>
              <input
                dir="ltr"
                autoComplete="tel"
                className={inputLtr}
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[12px] text-[#6b7280] mb-1">{tb.date}</label>
              <input
                type="date"
                dir="ltr"
                min={localISODate()}
                className={inputLtr}
                value={newDate}
                onChange={(e) => {
                  const v = e.target.value
                  const today = localISODate()
                  setNewDate(v < today ? today : v)
                }}
              />
            </div>
            <div>
              <label className="block text-[12px] text-[#6b7280] mb-1">{tb.time}</label>
              <select dir="ltr" className={inputLtr} value={newTime} onChange={(e) => setNewTime(e.target.value)}>
                {timeOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {createError && (
            <p className="text-[13px] font-medium text-red-600" role="alert">
              {createError}
            </p>
          )}
          <button
            type="submit"
            disabled={createBusy}
            className="px-5 py-2.5 rounded-lg text-white text-[14px] font-bold hover:opacity-90 disabled:opacity-60"
            style={{ background: gradient }}
          >
            {createBusy ? t.common.saving : tb.saveBooking}
          </button>
        </form>

        <div className="flex justify-between items-center mb-5 gap-3 flex-wrap">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={tb.searchPlaceholder}
            className="px-4 py-2.5 border border-[#d9d9d9] rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#1B1BB3]/20 focus:border-[#1B1BB3] bg-white transition-all text-start w-full sm:w-72"
          />
          <button
            type="button"
            onClick={fetchBookings}
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-[14px] font-bold hover:opacity-90 transition-opacity disabled:opacity-60"
            style={{ background: gradient }}
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{' '}
                {t.common.loading}
              </>
            ) : (
              t.common.refresh
            )}
          </button>
        </div>

        {!loading && filtered.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-100 py-16 text-center text-[#9ca3af] text-[14px]">
            {search ? tb.noResults : tb.empty}
          </div>
        )}

        <div className="flex flex-col gap-3 md:hidden">
          {filtered.map((booking) => (
            <div key={booking.id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              {editingId === booking.id ? (
                <div className="space-y-3">
                  <input
                    dir="auto"
                    autoComplete="name"
                    className={inputName}
                    value={editDraft.name}
                    onChange={(e) => setEditDraft((d) => ({ ...d, name: e.target.value }))}
                  />
                  <input
                    dir="ltr"
                    autoComplete="tel"
                    className={inputLtr}
                    value={editDraft.phone}
                    onChange={(e) => setEditDraft((d) => ({ ...d, phone: e.target.value }))}
                  />
                  <input
                    type="date"
                    dir="ltr"
                    min={localISODate()}
                    className={inputLtr}
                    value={editDraft.date}
                    onChange={(e) => {
                      const v = e.target.value
                      const today = localISODate()
                      setEditDraft((d) => ({ ...d, date: v < today ? today : v }))
                    }}
                  />
                  <select
                    dir="ltr"
                    className={inputLtr}
                    value={editDraft.time}
                    onChange={(e) => setEditDraft((d) => ({ ...d, time: e.target.value }))}
                  >
                    {editTimeChoices.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  {editError && (
                    <p className="text-[13px] font-medium text-red-600" role="alert">
                      {editError}
                    </p>
                  )}
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="px-3 py-2 border border-gray-200 rounded-lg text-[13px]"
                    >
                      <X size={16} className="inline" /> {t.common.cancel}
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveEdit}
                      disabled={saveBusy}
                      className="px-3 py-2 rounded-lg text-white text-[13px] disabled:opacity-60"
                      style={{ background: gradient }}
                    >
                      <Check size={16} className="inline" /> {t.common.save}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-2">
                    <div dir="auto" className="font-semibold text-[14px] text-[#111827] leading-snug text-start">
                      {booking.name}
                    </div>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => startEdit(booking)}
                        className="text-[#1B1BB3] hover:opacity-80 p-1"
                        aria-label={tb.ariaEdit}
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(booking.id)}
                        disabled={deleteId === booking.id}
                        className="text-red-400 hover:text-red-600 transition-colors disabled:opacity-40 p-1"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                  <div className="text-[13px] text-[#6b7280] mb-2">
                    <LtrField>{booking.phone}</LtrField>
                  </div>
                  <div className="flex gap-1.5 flex-wrap mb-2">
                    <span className="px-2 py-0.5 bg-[#eff6ff] text-[#1B1BB3] text-[11px] font-medium rounded-full">
                      {formatDate(booking.date, intlLocale)}
                    </span>
                    <span
                      dir="ltr"
                      className="px-2 py-0.5 bg-[#eff6ff] text-[#1B1BB3] text-[11px] font-medium rounded-full tabular-nums"
                    >
                      {booking.time}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#9ca3af]">
                    {tb.registered}{' '}
                    <LtrField className="!w-auto">{formatCreatedAt(booking.createdAt, intlLocale)}</LtrField>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {filtered.length > 0 && (
          <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  <th className="text-start px-6 py-3.5 text-[12px] font-semibold text-[#6b7280] uppercase tracking-wide">
                    {tb.colName}
                  </th>
                  <th className="text-start px-4 py-3.5 text-[12px] font-semibold text-[#6b7280] uppercase tracking-wide">
                    {tb.colPhone}
                  </th>
                  <th className="text-start px-4 py-3.5 text-[12px] font-semibold text-[#6b7280] uppercase tracking-wide">
                    {tb.colDate}
                  </th>
                  <th className="text-start px-4 py-3.5 text-[12px] font-semibold text-[#6b7280] uppercase tracking-wide">
                    {tb.colTime}
                  </th>
                  <th className="text-start px-6 py-3.5 text-[12px] font-semibold text-[#6b7280] uppercase tracking-wide">
                    {tb.colRegistered}
                  </th>
                  <th className="px-6 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                    {editingId === booking.id ? (
                      <>
                        <td className="px-6 py-3">
                          <input
                            dir="auto"
                            autoComplete="name"
                            className={inputName}
                            value={editDraft.name}
                            onChange={(e) => setEditDraft((d) => ({ ...d, name: e.target.value }))}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            dir="ltr"
                            autoComplete="tel"
                            className={inputLtr}
                            value={editDraft.phone}
                            onChange={(e) => setEditDraft((d) => ({ ...d, phone: e.target.value }))}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="date"
                            dir="ltr"
                            min={localISODate()}
                            className={inputLtr}
                            value={editDraft.date}
                            onChange={(e) => {
                              const v = e.target.value
                              const today = localISODate()
                              setEditDraft((d) => ({ ...d, date: v < today ? today : v }))
                            }}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <select
                            dir="ltr"
                            className={inputLtr}
                            value={editDraft.time}
                            onChange={(e) => setEditDraft((d) => ({ ...d, time: e.target.value }))}
                          >
                            {editTimeChoices.map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-3 text-[13px] text-[#9ca3af] whitespace-nowrap text-left" dir="ltr">
                          {formatCreatedAt(booking.createdAt, intlLocale)}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap align-top">
                          {editError && (
                            <p className="text-[12px] font-medium text-red-600 mb-2 max-w-[200px]" role="alert">
                              {editError}
                            </p>
                          )}
                          <button
                            type="button"
                            onClick={handleSaveEdit}
                            disabled={saveBusy}
                            className="px-3 py-1.5 text-[12px] font-medium text-white rounded-lg mr-1 disabled:opacity-50"
                            style={{ background: gradient }}
                          >
                            {t.common.save}
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="px-3 py-1.5 text-[12px] font-medium border border-gray-200 rounded-lg"
                          >
                            {t.common.cancel}
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4">
                          <div dir="auto" className="font-medium text-[14px] text-[#111827] text-start">
                            {booking.name}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-[13px] text-[#6b7280] text-left" dir="ltr">
                          {booking.phone}
                        </td>
                        <td className="px-4 py-4 text-[13px] text-[#6b7280] whitespace-nowrap">
                          {formatDate(booking.date, intlLocale)}
                        </td>
                        <td className="px-4 py-4 text-left" dir="ltr">
                          <span className="inline-block px-2 py-0.5 bg-[#eff6ff] text-[#1B1BB3] text-[11px] font-medium rounded-full tabular-nums">
                            {booking.time}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[13px] text-[#9ca3af] whitespace-nowrap text-left" dir="ltr">
                          {formatCreatedAt(booking.createdAt, intlLocale)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 justify-end">
                            <button
                              type="button"
                              onClick={() => startEdit(booking)}
                              className="flex items-center gap-1 px-3 py-1.5 text-[12px] font-medium text-[#1B1BB3] border border-[#c7d2fe] rounded-lg hover:bg-[#eef2ff]"
                            >
                              <Pencil size={13} />
                              {t.common.edit}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(booking.id)}
                              disabled={deleteId === booking.id}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-40"
                            >
                              {deleteId === booking.id ? (
                                <span className="w-3 h-3 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                              ) : (
                                <Trash2 size={13} />
                              )}
                              {t.common.delete}
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
