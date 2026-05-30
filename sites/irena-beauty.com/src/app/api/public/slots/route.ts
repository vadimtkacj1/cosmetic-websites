import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { getSalonDataDir } from '@/lib/salon-data-dir'

/** Always read fresh slots.json from disk (admin changes must show on the site immediately). */
export const dynamic = 'force-dynamic'
export const revalidate = 0

const SLOTS_FILE = path.join(getSalonDataDir(), 'slots.json')

export interface DaySlots {
  enabled: boolean
  slots: string[]
}

type WeekSchedule = Record<number, DaySlots>

const DEFAULT_SLOTS = [
  '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00',
]

const DEFAULT_SCHEDULE: WeekSchedule = {
  0: { enabled: true, slots: DEFAULT_SLOTS },
  1: { enabled: true, slots: DEFAULT_SLOTS },
  2: { enabled: true, slots: DEFAULT_SLOTS },
  3: { enabled: true, slots: DEFAULT_SLOTS },
  4: { enabled: true, slots: DEFAULT_SLOTS },
  5: { enabled: true, slots: DEFAULT_SLOTS },
  6: { enabled: false, slots: [] },
}

function readSchedule(): WeekSchedule {
  try {
    if (!fs.existsSync(SLOTS_FILE)) return DEFAULT_SCHEDULE
    return JSON.parse(fs.readFileSync(SLOTS_FILE, 'utf-8')) as WeekSchedule
  } catch {
    return DEFAULT_SCHEDULE
  }
}

/** Public read-only schedule for the booking form (no auth). */
export async function GET() {
  const schedule = readSchedule()
  return NextResponse.json(
    { schedule },
    {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    }
  )
}
