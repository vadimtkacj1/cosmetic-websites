import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('next/headers', () => ({
  cookies: () => ({
    get: (name: string) =>
      name === 'admin_session' ? { value: '1' } : undefined,
  }),
}))

describe('admin /api/admin/bookings', () => {
  let tmpDir: string

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'salon-admin-'))
    process.env.SALON_DATA_DIR = tmpDir
    process.env.SALON_TENANT_ID = 't1'
  })

  afterEach(() => {
    vi.resetModules()
    fs.rmSync(tmpDir, { recursive: true, force: true })
    delete process.env.SALON_DATA_DIR
    delete process.env.SALON_TENANT_ID
  })

  it('POST creates booking', async () => {
    const { POST } = await import('@/app/api/admin/bookings/route')
    const req = new NextRequest('http://localhost/api/admin/bookings', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Admin User',
        phone: '111',
        date: '2099-03-01',
        time: '11:00',
      }),
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
  })

  it('PATCH allows keeping past date but blocks moving to new past date', async () => {
    const { POST, PATCH } = await import('@/app/api/admin/bookings/route')
    const postRes = await POST(
      new NextRequest('http://localhost/api/admin/bookings', {
        method: 'POST',
        body: JSON.stringify({
          name: 'p',
          phone: '1',
          date: '2099-04-01',
          time: '09:00',
        }),
      }),
    )
    const { booking } = (await postRes.json()) as { booking: { id: string; date: string } }
    const id = booking.id

    const patchPast = await PATCH(
      new NextRequest('http://localhost/api/admin/bookings', {
        method: 'PATCH',
        body: JSON.stringify({ id, date: '2019-01-01' }),
      }),
    )
    expect(patchPast.status).toBe(400)

    const patchKeep = await PATCH(
      new NextRequest('http://localhost/api/admin/bookings', {
        method: 'PATCH',
        body: JSON.stringify({ id, date: '2099-04-01', time: '10:30' }),
      }),
    )
    expect(patchKeep.status).toBe(200)
  })
})
