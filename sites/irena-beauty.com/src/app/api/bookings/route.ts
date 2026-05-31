import { NextRequest, NextResponse } from 'next/server'
import { addBooking, readBookings, removeBooking } from '@/lib/bookings-store'
import { notifyTelegramInstantBooking } from '@/lib/telegram-instant-notify'
import { notifyOwner } from '@/lib/owner-notify'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

export async function POST(request: NextRequest) {
  let body: { name?: string; phone?: string; treatment?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { name, phone, treatment } = body
  if (!name?.trim() || !phone?.trim() || !treatment?.trim()) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const booking = addBooking({ name, phone, treatment })
  void notifyTelegramInstantBooking({
    tenantId: booking.tenantId,
    name: booking.name,
    phone: booking.phone,
    date: booking.treatment ?? '',
    time: '',
  })
  void notifyOwner({
    name: booking.name,
    phone: booking.phone,
    treatment: booking.treatment,
  })
  return NextResponse.json({ success: true, booking })
}

export async function GET(request: NextRequest) {
  const password = request.nextUrl.searchParams.get('password')
  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json({ bookings: readBookings() })
}

export async function DELETE(request: NextRequest) {
  const password = request.nextUrl.searchParams.get('password')
  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await request.json() as { id: string }
  removeBooking(id)
  return NextResponse.json({ success: true })
}
