import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

describe('POST /api/bookings', () => {
  let tmpDir: string

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'salon-api-'))
    process.env.SALON_DATA_DIR = tmpDir
    process.env.SALON_TENANT_ID = 'tenant-a'
    process.env.ADMIN_PASSWORD = 'secret-admin'
  })

  afterEach(() => {
    vi.resetModules()
    fs.rmSync(tmpDir, { recursive: true, force: true })
    delete process.env.SALON_DATA_DIR
    delete process.env.SALON_TENANT_ID
    delete process.env.ADMIN_PASSWORD
  })

  it('creates booking when date is valid and not in past', async () => {
    const { POST } = await import('@/app/api/bookings/route')
    const future = '2099-06-15'
    const req = new NextRequest('http://localhost/api/bookings', {
      method: 'POST',
      body: JSON.stringify({
        name: '  דנה  ',
        phone: ' 050  ',
        date: future,
        time: '10:00',
      }),
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
    const body = (await res.json()) as { success: boolean; booking: { tenantId: string } }
    expect(body.success).toBe(true)
    expect(body.booking.tenantId).toBe('tenant-a')

    const raw = JSON.parse(
      fs.readFileSync(path.join(tmpDir, 'bookings.json'), 'utf-8'),
    ) as Array<{ name: string; date: string }>
    expect(raw[0].name).toBe('דנה')
    expect(raw[0].date).toBe(future)
  })

  it('rejects past dates', async () => {
    const { POST } = await import('@/app/api/bookings/route')
    const req = new NextRequest('http://localhost/api/bookings', {
      method: 'POST',
      body: JSON.stringify({
        name: 'x',
        phone: 'y',
        date: '2020-01-01',
        time: '10:00',
      }),
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('rejects invalid JSON', async () => {
    const { POST } = await import('@/app/api/bookings/route')
    const req = new NextRequest('http://localhost/api/bookings', {
      method: 'POST',
      body: 'not-json',
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('GET requires password', async () => {
    const { GET } = await import('@/app/api/bookings/route')
    const bad = new NextRequest('http://localhost/api/bookings')
    expect((await GET(bad)).status).toBe(401)
    const ok = new NextRequest('http://localhost/api/bookings?password=secret-admin')
    const res = await GET(ok)
    expect(res.status).toBe(200)
  })
})
