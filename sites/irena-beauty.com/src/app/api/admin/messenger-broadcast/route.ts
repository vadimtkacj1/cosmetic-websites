import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { readMessengerBroadcast, regenerateSubscribeCode } from '@/lib/messenger-broadcast-store'

async function isAuthed(): Promise<boolean> {
  const cookieStore = await cookies()
  return cookieStore.get('admin_session')?.value === '1'
}

export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json(readMessengerBroadcast())
}

export async function POST(req: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = (await req.json()) as { action?: string }
    if (body.action === 'regenerate') {
      return NextResponse.json(regenerateSubscribeCode())
    }
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
}
