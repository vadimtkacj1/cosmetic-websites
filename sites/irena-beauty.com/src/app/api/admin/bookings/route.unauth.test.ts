import { describe, expect, it, vi } from 'vitest'

vi.mock('next/headers', () => ({
  cookies: () => ({
    get: () => undefined,
  }),
}))

describe('admin /api/admin/bookings unauthenticated', () => {
  it('GET returns 401', async () => {
    const { GET } = await import('@/app/api/admin/bookings/route')
    const res = await GET()
    expect(res.status).toBe(401)
  })
})
