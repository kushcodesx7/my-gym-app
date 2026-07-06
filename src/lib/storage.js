// ===========================================================================
// storage.js — everything about reading/writing the browser's localStorage.
// localStorage is a tiny key/value store built into every browser. It keeps
// data even after you close the tab, so your history survives.
// ===========================================================================

// We prefix every key with "ironlog." so we never clash with other sites.
const PREFIX = 'ironlog.'

// All the keys this app uses, in one place.
export const KEYS = {
  profile: PREFIX + 'profile',
  workouts: PREFIX + 'workouts',       // { '2026-07-06': {...session} }
  dietTemplate: PREFIX + 'dietTemplate', // customizable meal list
  dietLog: PREFIX + 'dietLog',         // { '2026-07-06': { checked: {id:true} } }
  bodyStats: PREFIX + 'bodyStats',     // [ {date, weight, waist} ]
}

// Read a value and parse it from JSON. If nothing is stored, return `fallback`.
export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (raw == null) return fallback
    return JSON.parse(raw)
  } catch (e) {
    console.warn('Could not read', key, e)
    return fallback
  }
}

// Save a value as JSON.
export function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.warn('Could not save', key, e)
  }
}

// --- Export / Import: bundle EVERYTHING into one JSON object -------------

export function exportAll() {
  const data = {}
  for (const key of Object.values(KEYS)) {
    const raw = localStorage.getItem(key)
    if (raw != null) data[key] = JSON.parse(raw)
  }
  return {
    app: 'iron-log',
    version: 1,
    exportedAt: new Date().toISOString(),
    data,
  }
}

// Take a bundle produced by exportAll() and write it back in.
export function importAll(bundle) {
  if (!bundle || typeof bundle !== 'object' || !bundle.data) {
    throw new Error('That file does not look like an Iron Log backup.')
  }
  for (const [key, value] of Object.entries(bundle.data)) {
    // Only accept keys we recognise, for safety.
    if (Object.values(KEYS).includes(key)) {
      localStorage.setItem(key, JSON.stringify(value))
    }
  }
}

// Wipe every Iron Log key (used by the "reset" button).
export function clearAll() {
  for (const key of Object.values(KEYS)) localStorage.removeItem(key)
}
