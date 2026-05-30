import { NextRequest, NextResponse } from 'next/server'
import { isBookingDateNotInPast, isValidBookingDateString } from '@/lib/booking-date'
import { addBooking, readBookings, removeBooking } from '@/lib/bookings-store'
import { notifyTelegramInstantBooking } from '@/lib/telegram-instant-notify'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

export async function POST(request: NextRequest) {
  let body: { name?: string; phone?: string; date?: string; time?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { name, phone, date, time } = body
  if (!name || !phone || !date || !time) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  if (!isValidBookingDateString(date)) {
    return NextResponse.json({ error: 'תאריך לא תקין' }, { status: 400 })
  }
  if (!isBookingDateNotInPast(date)) {
    return NextResponse.json(
      { error: 'לא ניתן לקבוע תור לתאריך שעבר' },
      { status: 400 }
    )
  }

  const booking = addBooking({ name, phone, date, time })
  void notifyTelegramInstantBooking({
    tenantId: booking.tenantId,
    name: booking.name,
    phone: booking.phone,
    date: booking.date,
    time: booking.time,
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
