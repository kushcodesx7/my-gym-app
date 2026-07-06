// ===========================================================================
// date.js — small date helpers. We store dates as "YYYY-MM-DD" strings so they
// sort nicely and read the same on every device.
// ===========================================================================

// Turn a Date object into "2026-07-06" (using LOCAL time, not UTC).
export function toKey(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// Today's key.
export function todayKey() {
  return toKey(new Date())
}

// Parse "2026-07-06" back into a Date at local midnight.
export function fromKey(key) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

// Friendly label like "Mon 6 Jul".
export function prettyDate(key) {
  const d = fromKey(key)
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

// 0 = Sunday … 6 = Saturday
export function weekdayIndex(date = new Date()) {
  return date.getDay()
}

// Which ISO-ish week does a date fall in? We use this to group weekly volume.
// Returns a "YYYY-Www" style key based on the Monday of that week.
export function weekKey(date) {
  const d = new Date(date)
  const day = (d.getDay() + 6) % 7 // make Monday = 0
  d.setDate(d.getDate() - day)
  return toKey(d)
}

// Number of days between two date keys (b - a).
export function daysBetween(aKey, bKey) {
  const a = fromKey(aKey)
  const b = fromKey(bKey)
  return Math.round((b - a) / (1000 * 60 * 60 * 24))
}
