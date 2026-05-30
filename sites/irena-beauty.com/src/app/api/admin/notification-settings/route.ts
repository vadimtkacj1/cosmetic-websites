import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import {
  patchNotificationSettings,
  readNotificationSettings,
} from '@/lib/notification-settings-store'

async function isAuthed(): Promise<boolean> {
  const cookieStore = await cookies()
  return cookieStore.get('admin_session')?.value === '1'
}

export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json(readNotificationSettings())
}

export async function PATCH(request: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  let body: Partial<{
    enabled: boolean
    mode: 'scheduled' | 'instant'
    timeLocal: string
    timezone: string
  }>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  const result = patchNotificationSettings({
    enabled: body.enabled,
    mode: body.mode,
    timeLocal: body.timeLocal,
    timezone: body.timezone,
  })
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }
  return NextResponse.json(result.settings)
}
