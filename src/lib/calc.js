// ===========================================================================
// calc.js — the maths: calories burned, volume, weight trends, etc.
// Kept separate so the pages stay simple and easy to read.
// ===========================================================================

// --- Calories burned during a workout ------------------------------------
// The classic MET formula:  kcal = MET × bodyweight(kg) × duration(hours)
// We estimate each completed set takes about 45 seconds of work plus its rest
// period. We only count sets you actually ticked "done".
export function sessionCalories(session, bodyWeightKg, plan) {
  if (!session || !plan) return 0
  let kcal = 0
  for (const ex of plan.exercises) {
    const logged = session.exercises?.[ex.id]
    if (!logged) continue
    const doneSets = logged.sets.filter((s) => s.done).length
    if (!doneSets) continue
    const workSecs = 45
    const blockSecs = workSecs + ex.rest
    const hours = (doneSets * blockSecs) / 3600
    kcal += ex.met * bodyWeightKg * hours
  }
  return Math.round(kcal)
}

// --- Session progress (how many sets ticked done of the total) -----------
export function sessionProgress(session, plan) {
  if (!plan || plan.exercises.length === 0) return { done: 0, total: 0, pct: 0 }
  let done = 0
  let total = 0
  for (const ex of plan.exercises) {
    total += ex.sets
    const logged = session?.exercises?.[ex.id]
    if (logged) done += logged.sets.filter((s) => s.done).length
  }
  const pct = total ? Math.round((done / total) * 100) : 0
  return { done, total, pct }
}

// --- Best working set for one exercise on one day ------------------------
// Used by the progress charts. We take the heaviest weight you logged that day
// (only counting sets that have both a weight and reps entered).
export function bestSetWeight(loggedExercise) {
  if (!loggedExercise) return null
  let best = null
  for (const s of loggedExercise.sets) {
    const w = Number(s.weight)
    const r = Number(s.reps)
    if (w > 0 && r > 0) {
      if (best == null || w > best) best = w
    }
  }
  return best
}

// --- Total volume for one exercise on one day (weight × reps summed) -----
export function exerciseVolume(loggedExercise) {
  if (!loggedExercise) return 0
  let vol = 0
  for (const s of loggedExercise.sets) {
    const w = Number(s.weight) || 0
    const r = Number(s.reps) || 0
    vol += w * r
  }
  return vol
}

// --- Did a session have any real work done? -------------------------------
export function sessionHasWork(session) {
  if (!session?.exercises) return false
  return Object.values(session.exercises).some((ex) =>
    ex.sets?.some((s) => s.done)
  )
}

// --- Current training streak (days) ---------------------------------------
// Counts back from today. A day counts if you logged work. Sundays (rest day)
// don't break the streak. Today not training yet doesn't break it either.
export function currentStreak(workouts, todayDateKey) {
  let streak = 0
  const d = new Date(todayDateKey + 'T00:00:00')
  for (let i = 0; i < 366; i++) {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const key = `${y}-${m}-${day}`
    const trained = sessionHasWork(workouts[key])
    if (trained) {
      streak++
    } else if (d.getDay() === 0 || i === 0) {
      // Sunday rest day, or today (session not done yet) — skip, don't break.
    } else {
      break
    }
    d.setDate(d.getDate() - 1)
  }
  return streak
}

// --- Lifetime totals (for the hero header) --------------------------------
export function lifetimeStats(workouts) {
  let sessions = 0
  let volume = 0
  for (const s of Object.values(workouts)) {
    if (!sessionHasWork(s)) continue
    sessions++
    for (const ex of Object.values(s.exercises)) volume += exerciseVolume(ex)
  }
  return { sessions, volume: Math.round(volume) }
}

// --- Estimated session duration in minutes --------------------------------
export function sessionMinutes(plan) {
  if (!plan) return 0
  let secs = 0
  for (const ex of plan.exercises) secs += ex.sets * (45 + ex.rest)
  return Math.round(secs / 60)
}

// --- Rate of change for body weight (kg per week) ------------------------
// Uses the first and last entries and the days between them.
export function weeklyRate(entries) {
  if (!entries || entries.length < 2) return null
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date))
  const first = sorted[0]
  const last = sorted[sorted.length - 1]
  const days =
    (new Date(last.date) - new Date(first.date)) / (1000 * 60 * 60 * 24)
  if (days <= 0) return null
  const kgChange = Number(last.weight) - Number(first.weight)
  return (kgChange / days) * 7 // kg per week
}
