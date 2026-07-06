// ===========================================================================
// ExerciseCard — one exercise on the workout page.
// v2: muscle icon avatar, live "NEW PR" badge when you beat your previous
// best weight, and a ghost hint showing what you lifted last time (the
// pattern Hevy/Strong use to push you to add one more rep or kilo).
// ===========================================================================
import { useState } from 'react'

// A little icon per exercise so cards scan visually, not just as text.
const ICONS = {
  'chest-press': '🏋️',
  'db-shoulder-press': '💪',
  'incline-db-press': '📐',
  'lateral-raises': '🦅',
  'tricep-rope-pushdown': '🪢',
  'lat-pulldown': '⬇️',
  'seated-cable-row': '🚣',
  'face-pulls': '🎯',
  'db-bicep-curls': '💪',
  'hammer-curls': '🔨',
  'leg-press': '🦵',
  'leg-extension': '🦿',
  'leg-curl': '🌀',
  'calf-raises': '🧗',
  'plank': '🧘',
}

export default function ExerciseCard({
  exercise,
  logged,
  onChange,
  onToggleDone,
  lastBest,
}) {
  const [open, setOpen] = useState(false)
  const repUnit = exercise.repUnit || 'reps'

  const doneCount = logged.sets.filter((s) => s.done).length
  const complete = doneCount === exercise.sets

  // PR detection: best weight ticked done today vs your previous best.
  const todayBest = logged.sets.reduce((best, s) => {
    const w = Number(s.weight)
    return s.done && w > 0 && Number(s.reps) > 0 && w > best ? w : best
  }, 0)
  const isPR = lastBest != null && todayBest > lastBest

  return (
    <div className={'card exercise' + (complete ? ' complete' : '')}>
      <div className="row between" style={{ alignItems: 'flex-start' }}>
        <div className="ex-head">
          <div className="ex-icon">{complete ? '✅' : ICONS[exercise.id] || '🏋️'}</div>
          <div>
            <div className="row wrap" style={{ gap: 8 }}>
              <h3>{exercise.name}</h3>
              {isPR && <span className="pr-badge">🏆 New PR</span>}
            </div>
            <div className="row wrap mt-s" style={{ gap: 6 }}>
              <span className={'pill ' + (exercise.type === 'compound' ? 'pill-accent' : '')}>
                {exercise.type}
              </span>
              <span className="pill">
                {exercise.sets} × {exercise.repLow}–{exercise.repHigh} {repUnit}
              </span>
              <span className="pill">rest {exercise.rest}s</span>
            </div>
          </div>
        </div>
        <div className="center" style={{ flexShrink: 0 }}>
          <div
            className="big-num"
            style={{ fontSize: '1.5rem', color: complete ? 'var(--green)' : 'var(--text)' }}
          >
            {doneCount}/{exercise.sets}
          </div>
          <div className="stat-label">sets</div>
        </div>
      </div>

      {lastBest != null && !isPR && (
        <div className="faint mt-s" style={{ fontSize: '0.8rem' }}>
          Last best: <span className="accent">{lastBest} kg</span> — beat it for a PR 🏆
        </div>
      )}

      {/* set rows */}
      <div className="sets mt">
        <div className="set-head">
          <span>Set</span>
          <span>Weight (kg)</span>
          <span>{repUnit === 'sec' ? 'Seconds' : 'Reps'}</span>
          <span>Done</span>
        </div>
        {logged.sets.map((s, i) => (
          <div className={'set-row' + (s.done ? ' done' : '')} key={i}>
            <span className="set-num">{i + 1}</span>
            <input
              type="number"
              inputMode="decimal"
              placeholder={lastBest != null ? String(lastBest) : '0'}
              value={s.weight}
              onChange={(e) => onChange(exercise.id, i, 'weight', e.target.value)}
              aria-label={`${exercise.name} set ${i + 1} weight`}
            />
            <input
              type="number"
              inputMode="numeric"
              placeholder={String(exercise.repLow)}
              value={s.reps}
              onChange={(e) => onChange(exercise.id, i, 'reps', e.target.value)}
              aria-label={`${exercise.name} set ${i + 1} reps`}
            />
            <button
              className={'check' + (s.done ? ' on' : '')}
              onClick={() => onToggleDone(exercise, i, !s.done)}
              aria-pressed={s.done}
              aria-label={`Mark set ${i + 1} done`}
            >
              {s.done ? '✓' : ''}
            </button>
          </div>
        ))}
      </div>

      {/* how-to guide */}
      <button className="guide-toggle" onClick={() => setOpen((o) => !o)}>
        <span>{open ? '▾' : '▸'} How to do it</span>
      </button>
      {open && <p className="guide-text">{exercise.guide}</p>}
    </div>
  )
}
