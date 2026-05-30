/** Local calendar date YYYY-MM-DD (browser or Node with system TZ). */
export function localISODate(d = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/

/** True if string is a real calendar day (not e.g. 2026-02-31). */
export function isValidBookingDateString(dateStr: string): boolean {
  if (!ISO_DATE_RE.test(dateStr)) return false
  const y = Number(dateStr.slice(0, 4))
  const mo = Number(dateStr.slice(5, 7))
  const da = Number(dateStr.slice(8, 10))
  const d = new Date(y, mo - 1, da)
  return d.getFullYear() === y && d.getMonth() === mo - 1 && d.getDate() === da
}

/** Today or a future day in local calendar (compare as YYYY-MM-DD strings). */
export function isBookingDateNotInPast(dateStr: string, now = new Date()): boolean {
  if (!isValidBookingDateString(dateStr)) return false
  return dateStr >= localISODate(now)
}
