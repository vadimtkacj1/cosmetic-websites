import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('GET /api/public/slots', () => {
  let tmpDir: string

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'salon-slots-'))
    process.env.SALON_DATA_DIR = tmpDir
  })

  afterEach(() => {
    vi.resetModules()
    fs.rmSync(tmpDir, { recursive: true, force: true })
    delete process.env.SALON_DATA_DIR
  })

  it('returns custom schedule from slots.json', async () => {
    const schedule = {
      1: { enabled: true, slots: ['09:00', '09:30'] },
    }
    fs.writeFileSync(
      path.join(tmpDir, 'slots.json'),
      JSON.stringify(schedule),
      'utf-8',
    )
    const { GET } = await import('@/app/api/public/slots/route')
    const res = await GET()
    expect(res.status).toBe(200)
    const body = (await res.json()) as { schedule: typeof schedule }
    expect(body.schedule['1'].slots).toEqual(['09:00', '09:30'])
    expect(res.headers.get('Cache-Control')).toContain('no-store')
  })
})
