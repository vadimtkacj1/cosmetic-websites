import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import fs from 'fs'
import path from 'path'
import { getSalonDataDir } from '@/lib/salon-data-dir'

const SLOTS_FILE = path.join(getSalonDataDir(), 'slots.json')

export interface DaySlots {
  enabled: boolean
  slots: string[]
}

export interface WeekSchedule {
  0: DaySlots // Sunday
  1: DaySlots // Monday
  2: DaySlots // Tuesday
  3: DaySlots // Wednesday
  4: DaySlots // Thursday
  5: DaySlots // Friday
  6: DaySlots // Saturday
}

const DEFAULT_SLOTS = [
  '10:00','10:30','11:00','11:30','12:00','12:30',
  '13:00','13:30','14:00','14:30','15:00','15:30',
  '16:00','16:30','17:00','17:30','18:00',
]

const DEFAULT_SCHEDULE: WeekSchedule = {
  0: { enabled: true,  slots: DEFAULT_SLOTS },
  1: { enabled: true,  slots: DEFAULT_SLOTS },
  2: { enabled: true,  slots: DEFAULT_SLOTS },
  3: { enabled: true,  slots: DEFAULT_SLOTS },
  4: { enabled: true,  slots: DEFAULT_SLOTS },
  5: { enabled: true,  slots: DEFAULT_SLOTS },
  6: { enabled: false, slots: [] },
}

async function isAuthed(): Promise<boolean> {
  const cookieStore = await cookies()
  return cookieStore.get('admin_session')?.value === '1'
}

function readSchedule(): WeekSchedule {
  try {
    if (!fs.existsSync(SLOTS_FILE)) return DEFAULT_SCHEDULE
    return JSON.parse(fs.readFileSync(SLOTS_FILE, 'utf-8')) as WeekSchedule
  } catch {
    return DEFAULT_SCHEDULE
  }
}

function writeSchedule(schedule: WeekSchedule): void {
  fs.mkdirSync(path.dirname(SLOTS_FILE), { recursive: true })
  fs.writeFileSync(SLOTS_FILE, JSON.stringify(schedule, null, 2), 'utf-8')
}

export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json({ schedule: readSchedule() })
}

export async function POST(request: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { schedule } = await request.json() as { schedule: WeekSchedule }
  writeSchedule(schedule)
  return NextResponse.json({ success: true })
}
