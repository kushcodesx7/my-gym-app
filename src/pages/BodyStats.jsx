// ===========================================================================
// Body Stats page — log your weekly weight and waist measurement, see them
// charted over time, and check your rate of change against the ~0.5kg/week
// fat-loss target.
// ===========================================================================
import { useMemo, useState } from 'react'
import { useLocalStorage, DEFAULT_PROFILE } from '../lib/useLocalStorage'
import { KEYS } from '../lib/storage'
import { todayKey, prettyDate } from '../lib/date'
import { weeklyRate } from '../lib/calc'
import LineChart from '../components/LineChart'

export default function BodyStats() {
  const [profile, setProfile] = useLocalStorage(KEYS.profile, DEFAULT_PROFILE)
  const [entries, setEntries] = useLocalStorage(KEYS.bodyStats, [])

  const [date, setDate] = useState(todayKey())
  const [weight, setWeight] = useState('')
  const [waist, setWaist] = useState('')

  const sorted = useMemo(
    () => [...entries].sort((a, b) => a.date.localeCompare(b.date)),
    [entries]
  )

  function addEntry(e) {
    e.preventDefault()
    if (!weight && !waist) return
    const entry = { date, weight: Number(weight) || null, waist: Number(waist) || null }
    setEntries((prev) => {
      // Replace any existing entry on the same date, else add.
      const others = prev.filter((x) => x.date !== date)
      return [...others, entry]
    })
    // Keep the profile's current weight in sync with the latest log.
    if (weight && date >= (sorted[sorted.length - 1]?.date || '')) {
      setProfile((p) => ({ ...p, weightKg: Number(weight) }))
    }
    setWeight('')
    setWaist('')
  }

  function removeEntry(d) {
    setEntries((prev) => prev.filter((x) => x.date !== d))
  }

  const weightPoints = sorted
    .filter((e) => e.weight != null)
    .map((e) => ({ x: prettyDate(e.date), y: e.weight }))
  const waistPoints = sorted
    .filter((e) => e.waist != null)
    .map((e) => ({ x: prettyDate(e.date), y: e.waist }))

  const rate = weeklyRate(sorted.filter((e) => e.weight != null))
  const latestWeight = weightPoints[weightPoints.length - 1]?.y

  // Rate feedback: goal is roughly -0.5 kg/week.
  let rateNote = ''
  let rateColor = 'var(--text)'
  if (rate != null) {
    if (rate <= -0.25 && rate >= -0.9) {
      rateNote = 'On target — steady fat loss, muscle-sparing pace. 👌'
      rateColor = 'var(--green)'
    } else if (rate < -0.9) {
      rateNote = 'Dropping fast — consider eating a bit more to protect muscle.'
      rateColor = 'var(--accent)'
    } else if (rate > 0) {
      rateNote = 'Trending up — tighten the deficit if fat loss is the goal.'
      rateColor = 'var(--accent)'
    } else {
      rateNote = 'Roughly maintaining — nudge calories down slightly for fat loss.'
      rateColor = 'var(--text-dim)'
    }
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Body <span className="accent">Stats</span></h1>
          <div className="sub">Weekly weight & waist · goal ~0.5kg/week loss</div>
        </div>
      </div>

      {/* Add-entry form */}
      <div className="card">
        <h3>Log a measurement</h3>
        <form onSubmit={addEntry} className="mt">
          <div className="grid grid-3">
            <div className="field">
              <label>Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="field">
              <label>Weight (kg)</label>
              <input
                type="number"
                inputMode="decimal"
                step="0.1"
                placeholder="88.0"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Waist (cm)</label>
              <input
                type="number"
                inputMode="decimal"
                step="0.1"
                placeholder="86"
                value={waist}
                onChange={(e) => setWaist(e.target.value)}
              />
            </div>
          </div>
          <button className="btn btn-primary btn-block mt" type="submit">
            Save entry
          </button>
        </form>
      </div>

      {/* Summary stats */}
      <div className="grid grid-3">
        <div className="card center">
          <div className="stat-label">Current weight</div>
          <div className="big-num">{latestWeight ?? '—'}<span style={{ fontSize: '1rem' }}> kg</span></div>
        </div>
        <div className="card center">
          <div className="stat-label">Weekly change</div>
          <div className="big-num" style={{ color: rateColor }}>
            {rate != null ? `${rate > 0 ? '+' : ''}${rate.toFixed(2)}` : '—'}
            <span style={{ fontSize: '1rem' }}> kg/wk</span>
          </div>
        </div>
        <div className="card center">
          <div className="stat-label">Entries logged</div>
          <div className="big-num">{sorted.length}</div>
        </div>
      </div>

      {rateNote && (
        <div className="card" style={{ borderColor: rateColor }}>
          <div className="row" style={{ gap: 10 }}>
            <span style={{ fontSize: '1.4rem' }}>📉</span>
            <div style={{ color: rateColor }}>{rateNote}</div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-2">
        <div className="card">
          <h3>Weight over time</h3>
          <div className="mt">
            <LineChart points={weightPoints} unit="kg" />
          </div>
        </div>
        <div className="card">
          <h3>Waist over time</h3>
          <div className="mt">
            <LineChart points={waistPoints} unit="cm" color="#58a6ff" />
          </div>
        </div>
      </div>

      {/* History list */}
      {sorted.length > 0 && (
        <div className="card">
          <h3>History</h3>
          <div className="mt">
            {[...sorted].reverse().map((e) => (
              <div className="row between hist-row" key={e.date}>
                <span className="muted">{prettyDate(e.date)}</span>
                <span>{e.weight != null ? `${e.weight} kg` : '—'}</span>
                <span className="faint">{e.waist != null ? `${e.waist} cm` : '—'}</span>
                <button
                  className="btn btn-sm btn-ghost"
                  style={{ color: 'var(--red)', minHeight: 32 }}
                  onClick={() => removeEntry(e.date)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
