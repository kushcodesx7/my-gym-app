// ===========================================================================
// Progress page — turns your logged workout history into charts.
// Pick an exercise to see the weight you lifted over time, plus a summary of
// your total training volume per week.
// ===========================================================================
import { useMemo, useState } from 'react'
import { useLocalStorage } from '../lib/useLocalStorage'
import { KEYS } from '../lib/storage'
import { prettyDate, weekKey } from '../lib/date'
import { findExercise } from '../lib/workoutPlan'
import { bestSetWeight, exerciseVolume } from '../lib/calc'
import LineChart from '../components/LineChart'

export default function Progress() {
  const [workouts] = useLocalStorage(KEYS.workouts, {})

  // Build, for every exercise that has data, a list of { date, best } points.
  const perExercise = useMemo(() => {
    const map = {} // exId -> [{x, y}]
    const dates = Object.keys(workouts).sort()
    for (const d of dates) {
      const s = workouts[d]
      if (!s?.exercises) continue
      for (const [exId, logged] of Object.entries(s.exercises)) {
        const best = bestSetWeight(logged)
        if (best != null) {
          if (!map[exId]) map[exId] = []
          map[exId].push({ x: prettyDate(d), y: best })
        }
      }
    }
    return map
  }, [workouts])

  const exerciseIds = Object.keys(perExercise)
  const [selected, setSelected] = useState(exerciseIds[0] || '')
  const activeId = perExercise[selected] ? selected : exerciseIds[0] || ''

  // Weekly total volume across ALL exercises.
  const weeklyVolume = useMemo(() => {
    const weeks = {} // weekStartKey -> total volume
    for (const [d, s] of Object.entries(workouts)) {
      if (!s?.exercises) continue
      const wk = weekKey(new Date(d))
      let vol = 0
      for (const logged of Object.values(s.exercises)) vol += exerciseVolume(logged)
      weeks[wk] = (weeks[wk] || 0) + vol
    }
    return Object.entries(weeks)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([wk, vol]) => ({ x: prettyDate(wk), y: Math.round(vol) }))
  }, [workouts])

  if (exerciseIds.length === 0) {
    return (
      <div>
        <div className="page-head">
          <div>
            <h1><span className="accent">Progress</span></h1>
            <div className="sub">Your lifting trends over time</div>
          </div>
        </div>
        <div className="card empty">
          <div className="icon">📊</div>
          <h2 style={{ marginTop: 8 }}>No history yet</h2>
          <p className="muted">
            Log a workout on the Workout page (enter weight + reps and tick sets
            done). Come back here to watch your numbers climb.
          </p>
        </div>
      </div>
    )
  }

  const activeDef = findExercise(activeId)
  const points = perExercise[activeId] || []
  const latest = points[points.length - 1]?.y
  const first = points[0]?.y
  const change = latest != null && first != null ? latest - first : 0

  return (
    <div>
      <div className="page-head">
        <div>
          <h1><span className="accent">Progress</span></h1>
          <div className="sub">Your lifting trends over time</div>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <div className="row between wrap">
            <h3>Weight per exercise</h3>
            <select value={activeId} onChange={(e) => setSelected(e.target.value)} style={{ width: 'auto' }}>
              {exerciseIds.map((id) => (
                <option key={id} value={id}>
                  {findExercise(id)?.name || id}
                </option>
              ))}
            </select>
          </div>
          <div className="row wrap mt-s" style={{ gap: 16 }}>
            <div>
              <div className="stat-label">Current best</div>
              <div className="big-num" style={{ fontSize: '1.8rem' }}>{latest} kg</div>
            </div>
            <div>
              <div className="stat-label">Since start</div>
              <div className="big-num" style={{ fontSize: '1.8rem', color: change >= 0 ? 'var(--green)' : 'var(--red)' }}>
                {change >= 0 ? '+' : ''}{change} kg
              </div>
            </div>
          </div>
          <div className="mt">
            <LineChart points={points} unit="kg" />
          </div>
          <p className="faint mt-s" style={{ fontSize: '0.8rem' }}>
            Showing your heaviest working set for {activeDef?.name} each session.
          </p>
        </div>

        <div className="card">
          <h3>Weekly volume</h3>
          <p className="faint" style={{ fontSize: '0.8rem' }}>
            Total weight moved (weight × reps) across all lifts, per week.
          </p>
          <div className="mt">
            <LineChart points={weeklyVolume} unit="kg" color="#58a6ff" />
          </div>
          {weeklyVolume.length > 0 && (
            <div className="row between mt">
              <div>
                <div className="stat-label">This week</div>
                <div className="big-num" style={{ fontSize: '1.6rem' }}>
                  {weeklyVolume[weeklyVolume.length - 1].y.toLocaleString()} kg
                </div>
              </div>
              <div>
                <div className="stat-label">Weeks tracked</div>
                <div className="big-num" style={{ fontSize: '1.6rem' }}>{weeklyVolume.length}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
