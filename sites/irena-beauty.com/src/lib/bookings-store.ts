import fs from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'
import { getSalonDataDir } from '@/lib/salon-data-dir'

const BOOKINGS_FILE = path.join(getSalonDataDir(), 'bookings.json')

function deploymentTenantId(): string {
  return process.env.SALON_TENANT_ID?.trim() || 'default'
}

export interface Booking {
  id: string
  name: string
  phone: string
  date: string
  time: string
  createdAt: string
  /** Which salon / site instance (matches `tenants` keys in messenger-tenants.json). */
  tenantId: string
}

function normalizeBooking(raw: unknown): Booking | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  if (typeof o.id !== 'string' || typeof o.name !== 'string') return null
  const tenantRaw = o.tenantId
  const tenantId =
    typeof tenantRaw === 'string' && tenantRaw.trim() ? tenantRaw.trim() : 'default'
  return {
    id: o.id,
    name: o.name,
    phone: typeof o.phone === 'string' ? o.phone : '',
    date: typeof o.date === 'string' ? o.date : '',
    time: typeof o.time === 'string' ? o.time : '',
    createdAt: typeof o.createdAt === 'string' ? o.createdAt : new Date().toISOString(),
    tenantId,
  }
}

export function readBookings(): Booking[] {
  try {
    if (!fs.existsSync(BOOKINGS_FILE)) return []
    const parsed = JSON.parse(fs.readFileSync(BOOKINGS_FILE, 'utf-8')) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.map(normalizeBooking).filter((b): b is Booking => b !== null)
  } catch {
    return []
  }
}

export function writeBookings(bookings: Booking[]): void {
  fs.mkdirSync(path.dirname(BOOKINGS_FILE), { recursive: true })
  fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), 'utf-8')
}

export function addBooking(input: {
  name: string
  phone: string
  date: string
  time: string
}): Booking {
  const booking: Booking = {
    id: randomUUID(),
    name: input.name.trim(),
    phone: input.phone.trim(),
    date: input.date,
    time: input.time,
    createdAt: new Date().toISOString(),
    tenantId: deploymentTenantId(),
  }
  const bookings = readBookings()
  bookings.unshift(booking)
  writeBookings(bookings)
  return booking
}

export function removeBooking(id: string): void {
  writeBookings(readBookings().filter((b) => b.id !== id))
}

export function updateBooking(
  id: string,
  patch: { name?: string; phone?: string; date?: string; time?: string }
): Booking | null {
  const bookings = readBookings()
  const idx = bookings.findIndex((b) => b.id === id)
  if (idx === -1) return null
  const b = bookings[idx]
  const next: Booking = {
    ...b,
    name: patch.name !== undefined ? patch.name.trim() : b.name,
    phone: patch.phone !== undefined ? patch.phone.trim() : b.phone,
    date: patch.date !== undefined ? patch.date : b.date,
    time: patch.time !== undefined ? patch.time : b.time,
  }
  bookings[idx] = next
  writeBookings(bookings)
  return next
}
