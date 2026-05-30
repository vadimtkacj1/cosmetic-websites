import { describe, expect, it } from 'vitest'
import {
  isBookingDateNotInPast,
  isValidBookingDateString,
  localISODate,
} from '@/lib/booking-date'

describe('booking-date', () => {
  it('localISODate formats YYYY-MM-DD', () => {
    const d = new Date(2026, 4, 1)
    expect(localISODate(d)).toBe('2026-05-01')
  })

  it('isValidBookingDateString rejects bad format and invalid calendar days', () => {
    expect(isValidBookingDateString('2026-05-01')).toBe(true)
    expect(isValidBookingDateString('2026-2-01')).toBe(false)
    expect(isValidBookingDateString('2026-02-31')).toBe(false)
    expect(isValidBookingDateString('')).toBe(false)
  })

  it('isBookingDateNotInPast compares to reference date', () => {
    const now = new Date(2026, 4, 1)
    expect(isBookingDateNotInPast('2026-05-01', now)).toBe(true)
    expect(isBookingDateNotInPast('2026-04-30', now)).toBe(false)
    expect(isBookingDateNotInPast('not-a-date', now)).toBe(false)
  })
})
