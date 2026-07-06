// ===========================================================================
// useLocalStorage — a custom React "hook".
// It behaves just like React's useState, but it also saves the value to
// localStorage and reloads it when the app starts. So any page can keep its
// data permanently with a single line.
// ===========================================================================
import { useState, useEffect, useCallback } from 'react'
import { load, save } from './storage'

export function useLocalStorage(key, initialValue) {
  // Read the stored value once when the component first renders.
  const [value, setValue] = useState(() => load(key, initialValue))

  // Whenever the value changes, write it back to localStorage.
  useEffect(() => {
    save(key, value)
  }, [key, value])

  // A convenience wrapper so callers can do setValue(v) or setValue(prev => …).
  const set = useCallback((next) => {
    setValue((prev) => (typeof next === 'function' ? next(prev) : next))
  }, [])

  return [value, set]
}

// Your personal profile — pre-filled from what you told me.
export const DEFAULT_PROFILE = {
  name: 'Kush',
  sex: 'male',
  heightCm: 185,
  weightKg: 88,
  goal: 'Body recomposition — fat loss + lean muscle',
  daysPerWeek: 6,
  proteinMin: 160,
  proteinMax: 175,
  calorieTarget: 2200, // a sensible moderate-deficit starting estimate
}
