// ===========================================================================
// Workout page — "Today's Workout".
// Redesigned around motivation: a personal greeting + daily quote, a streak
// flame, a week consistency strip, a bold "mission" card for today's session,
// PR detection while you lift, and confetti when you finish.
// ===========================================================================
import { useMemo, useState } from 'react'
import { useLocalStorage, DEFAULT_PROFILE } from '../lib/useLocalStorage'
import { KEYS } from '../lib/storage'
import { todayKey, weekdayIndex, prettyDate } from '../lib/date'
import { DAYS, dayForWeekday } from '../lib/workoutPlan'
import {
  sessionCalories,
  sessionProgress,
  bestSetWeight,
  currentStreak,
  lifetimeStats,
  sessionMinutes,
} from '../lib/calc'
import { quoteOfTheDay, greeting } from '../lib/quotes'
import ExerciseCard from '../components/ExerciseCard'
import RestTimer from '../components/RestTimer'
import WeekStrip from '../components/WeekStrip'
import Confetti from '../components/Confetti'

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
  const [rest, setRest] = useState(null)

  const dateKey = todayKey()
  const autoDay = dayForWeekday(weekdayIndex())
  const [override, setOverride] = useState(null)
  const dayPlan = override ? DAYS[override] : autoDay

  const session = useMemo(() => {
    const existing = workouts[dateKey]
    if (existing && existing.day === dayPlan.key) return existing
    return newSession(dateKey, dayPlan)
  }, [workouts, dateKey, dayPlan])

  // Most recent best weight per exercise BEFORE today (for PR detection +
  // "previous" ghost hints in the set rows).
  const lastBests = useMemo(() => {
    const map = {}
    const dates = Object.keys(workouts).filter((d) => d < dateKey).sort()
    for (const d of dates) {
      const s = workouts[d]
      if (!s?.exercises) continue
      for (const [exId, logged] of Object.entries(s.exercises)) {
        const best = bestSetWeight(logged)
        if (best != null) map[exId] = best
      }
    }
    return map
  }, [workouts, dateKey])

  const streak = useMemo(() => currentStreak(workouts, dateKey), [workouts, dateKey])
  const lifetime = useMemo(() => lifetimeStats(workouts), [workouts])

  function updateSet(exId, setIndex, field, value) {
    setWorkouts((prev) => {
      const base = prev[dateKey]?.day === dayPlan.key ? prev[dateKey] : newSession(dateKey, dayPlan)
      const copy = structuredClone(base)
      copy.exercises[exId].sets[setIndex][field] = value
      return { ...prev, [dateKey]: copy }
    })
  }

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
  const minutes = sessionMinutes(dayPlan)

  return (
    <div>
      {/* HERO — greeting, streak, quote of the day */}
      <div className="hero">
        <div className="hero-top">
          <div>
            <div className="hero-greet">{greeting()} ·</div>
            <div className="hero-name">
              {profile.name || 'Athlete'} <span className="grad-text">💪</span>
            </div>
          </div>
          <div className="streak">
            <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>🔥</span>
            <span className="streak-num">{streak}</span>
            <span className="streak-label">day streak</span>
          </div>
        </div>
        <div className="hero-quote">“{quoteOfTheDay()}”</div>
      </div>

      {/* Week consistency strip */}
      <WeekStrip workouts={workouts} />

      {/* Day switcher */}
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
            Recovery is when muscle actually grows. Hydrate, hit your protein,
            maybe a light walk. Tap a day above if you want to train anyway.
          </p>
          {lifetime.sessions > 0 && (
            <p className="faint" style={{ fontSize: '0.85rem' }}>
              Lifetime: {lifetime.sessions} sessions · {lifetime.volume.toLocaleString()} kg moved
            </p>
          )}
        </div>
      ) : (
        <>
          {/* Today's mission card */}
          <div className="card mission">
            <div className="row between wrap">
              <div>
                <div className="stat-label">{prettyDate(dateKey)} · Today's mission</div>
                <div className="mission-day">{dayPlan.label}</div>
                <div className="mission-meta">
                  <span className="m">🎯 {dayPlan.focus}</span>
                  <span className="m">🏋️ {dayPlan.exercises.length} exercises</span>
                  <span className="m">⏱ ~{minutes} min</span>
                </div>
              </div>
              <div className="center" style={{ minWidth: 90 }}>
                <div className="big-num grad-text">{progress.pct}%</div>
                <div className="stat-label">{progress.done}/{progress.total} sets</div>
                <div className="stat-label mt-s" style={{ color: 'var(--accent)' }}>
                  🔥 {calories} kcal
                </div>
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
            <>
              <Confetti />
              <div className="card center" style={{ borderColor: 'rgba(63,185,80,0.5)' }}>
                <div style={{ fontSize: '2.4rem' }}>🏆</div>
                <h2 style={{ color: 'var(--green)', marginTop: 6 }}>Session crushed!</h2>
                <p className="muted">
                  ~{calories} kcal burned · streak now {streak >= 1 ? streak : 1} 🔥
                  <br />Go refuel that protein.
                </p>
              </div>
            </>
          )}
        </>
      )}

      <RestTimer active={rest} onDismiss={() => setRest(null)} />
    </div>
  )
}
