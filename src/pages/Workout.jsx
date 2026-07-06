// ===========================================================================
// Workout page — "Today's Workout".
// Figures out which PPL day it is, builds today's session from the plan, lets
// you log each set, starts the rest timer, and tracks progress + calories.
// ===========================================================================
import { useMemo, useState } from 'react'
import { useLocalStorage, DEFAULT_PROFILE } from '../lib/useLocalStorage'
import { KEYS } from '../lib/storage'
import { todayKey, weekdayIndex, prettyDate } from '../lib/date'
import { DAYS, WEEK_SCHEDULE, dayForWeekday } from '../lib/workoutPlan'
import { sessionCalories, sessionProgress, bestSetWeight } from '../lib/calc'
import ExerciseCard from '../components/ExerciseCard'
import RestTimer from '../components/RestTimer'

// Build a fresh, empty session object for a given day plan.
function newSession(dateKey, dayPlan) {
  const exercises = {}
  for (const ex of dayPlan.exercises) {
    exercises[ex.id] = {
      sets: Array.from({ length: ex.sets }, () => ({ weight: '', reps: '', done: false })),
    }
  }
  return { date: dateKey, day: dayPlan.key, exercises }
}

export default function Workout() {
  const [profile] = useLocalStorage(KEYS.profile, DEFAULT_PROFILE)
  const [workouts, setWorkouts] = useLocalStorage(KEYS.workouts, {})
  const [rest, setRest] = useState(null) // active rest timer

  const dateKey = todayKey()
  // Which day does the schedule say today is? (user can override below)
  const autoDay = dayForWeekday(weekdayIndex())

  // Let the user manually switch the day (e.g. they shifted their split).
  const [override, setOverride] = useState(null)
  const dayPlan = override ? DAYS[override] : autoDay

  // Get (or lazily create) today's session for the chosen day.
  const session = useMemo(() => {
    const existing = workouts[dateKey]
    if (existing && existing.day === dayPlan.key) return existing
    return newSession(dateKey, dayPlan)
  }, [workouts, dateKey, dayPlan])

  // Find the previous best weight for an exercise across history (for hints).
  const lastBests = useMemo(() => {
    const map = {}
    const dates = Object.keys(workouts).filter((d) => d < dateKey).sort()
    for (const d of dates) {
      const s = workouts[d]
      if (!s?.exercises) continue
      for (const [exId, logged] of Object.entries(s.exercises)) {
        const best = bestSetWeight(logged)
        if (best != null) map[exId] = best // later dates overwrite → most recent best
      }
    }
    return map
  }, [workouts, dateKey])

  // Save a change to a single set field.
  function updateSet(exId, setIndex, field, value) {
    setWorkouts((prev) => {
      const base = prev[dateKey]?.day === dayPlan.key ? prev[dateKey] : newSession(dateKey, dayPlan)
      const copy = structuredClone(base)
      copy.exercises[exId].sets[setIndex][field] = value
      return { ...prev, [dateKey]: copy }
    })
  }

  // Toggle a set's done checkbox — and start the rest timer when ticked on.
  function toggleDone(exercise, setIndex, isDone) {
    setWorkouts((prev) => {
      const base = prev[dateKey]?.day === dayPlan.key ? prev[dateKey] : newSession(dateKey, dayPlan)
      const copy = structuredClone(base)
      copy.exercises[exercise.id].sets[setIndex].done = isDone
      return { ...prev, [dateKey]: copy }
    })
    if (isDone) {
      setRest({
        token: `${exercise.id}-${setIndex}-${Date.now()}`,
        seconds: exercise.rest,
        label: `${exercise.name} · set ${setIndex + 1} done`,
      })
    }
  }

  const isRestDay = dayPlan.key === 'Rest'
  const progress = sessionProgress(session, dayPlan)
  const calories = sessionCalories(session, profile.weightKg, dayPlan)

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Today's <span className="accent">Workout</span></h1>
          <div className="sub">{prettyDate(dateKey)} · {dayPlan.focus}</div>
        </div>
        <span className="pill pill-accent">{dayPlan.label}</span>
      </div>

      {/* Day switcher — the schedule picks automatically, but you can change it */}
      <div className="day-switch">
        {['Push', 'Pull', 'Legs', 'Rest'].map((d) => (
          <button
            key={d}
            className={'day-chip' + (dayPlan.key === d ? ' active' : '')}
            onClick={() => setOverride(d === autoDay.key ? null : d)}
          >
            {d}
          </button>
        ))}
      </div>

      {isRestDay ? (
        <div className="card empty">
          <div className="icon">😴</div>
          <h2 style={{ marginTop: 8 }}>Rest & Recover</h2>
          <p className="muted">
            No lifting scheduled today. Recovery is when muscle actually grows.
            Stay hydrated, hit your protein, maybe a light walk. Tap a day above
            if you want to train anyway.
          </p>
        </div>
      ) : (
        <>
          {/* Session summary bar */}
          <div className="card">
            <div className="row between">
              <div>
                <div className="stat-label">Session progress</div>
                <div className="big-num">{progress.pct}%</div>
                <div className="faint">{progress.done} / {progress.total} sets done</div>
              </div>
              <div className="center">
                <div className="stat-label">Est. calories</div>
                <div className="big-num" style={{ color: 'var(--accent)' }}>
                  {calories}
                </div>
                <div className="faint">kcal burned</div>
              </div>
            </div>
            <div className="bar mt">
              <span style={{ width: `${progress.pct}%` }} />
            </div>
          </div>

          {/* Exercise cards */}
          {dayPlan.exercises.map((ex) => (
            <ExerciseCard
              key={ex.id}
              exercise={ex}
              logged={session.exercises[ex.id]}
              onChange={updateSet}
              onToggleDone={toggleDone}
              lastBest={lastBests[ex.id]}
            />
          ))}

          {progress.pct === 100 && (
            <div className="card center" style={{ borderColor: 'var(--green)' }}>
              <div className="icon" style={{ fontSize: '2rem' }}>🎉</div>
              <h2 style={{ color: 'var(--green)' }}>Session complete!</h2>
              <p className="muted">Nice work. ~{calories} kcal burned. Go refuel that protein.</p>
            </div>
          )}
        </>
      )}

      {/* The sticky rest timer floats above the bottom nav */}
      <RestTimer active={rest} onDismiss={() => setRest(null)} />
    </div>
  )
}
