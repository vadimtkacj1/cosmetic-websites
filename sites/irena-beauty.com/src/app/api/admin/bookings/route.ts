import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { isBookingDateNotInPast, isValidBookingDateString } from '@/lib/booking-date'
import { addBooking, readBookings, removeBooking, updateBooking } from '@/lib/bookings-store'
import { notifyTelegramInstantBooking } from '@/lib/telegram-instant-notify'

async function isAuthed(): Promise<boolean> {
  const cookieStore = await cookies()
  return cookieStore.get('admin_session')?.value === '1'
}

export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json({ bookings: readBookings() })
}

export async function POST(request: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  let body: { name?: string; phone?: string; date?: string; time?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  const { name, phone, date, time } = body
  if (!name?.trim() || !phone?.trim() || !date || !time) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }
  if (!isValidBookingDateString(date)) {
    return NextResponse.json({ error: 'תאריך לא תקין' }, { status: 400 })
  }
  if (!isBookingDateNotInPast(date)) {
    return NextResponse.json({ error: 'לא ניתן לשמור תור לתאריך שעבר' }, { status: 400 })
  }
  const booking = addBooking({ name, phone, date, time })
  void notifyTelegramInstantBooking({
    tenantId: booking.tenantId,
    name: booking.name,
    phone: booking.phone,
    date: booking.date,
    time: booking.time,
  })
  return NextResponse.json({ booking })
}

export async function PATCH(request: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  let body: { id?: string; name?: string; phone?: string; date?: string; time?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  const id = typeof body.id === 'string' ? body.id : ''
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }
  const hasPatch =
    body.name !== undefined ||
    body.phone !== undefined ||
    body.date !== undefined ||
    body.time !== undefined
  if (!hasPatch) {
    return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
  }
  const existing = readBookings().find((b) => b.id === id)
  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  if (body.date !== undefined) {
    if (!isValidBookingDateString(body.date)) {
      return NextResponse.json({ error: 'תאריך לא תקין' }, { status: 400 })
    }
    if (body.date !== existing.date && !isBookingDateNotInPast(body.date)) {
      return NextResponse.json({ error: 'לא ניתן להזיז תור לתאריך שעבר' }, { status: 400 })
    }
  }
  const updated = updateBooking(id, {
    name: body.name,
    phone: body.phone,
    date: body.date,
    time: body.time,
  })
  if (!updated) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json({ booking: updated })
}

export async function DELETE(request: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await request.json() as { id: string }
  removeBooking(id)
  return NextResponse.json({ success: true })
}
