// ===========================================================================
// ExerciseCard — one exercise on the workout page.
// Shows the target, a "how to do it" guide you can expand, and a row for each
// set with weight + reps inputs and a big "done" checkbox. Ticking done tells
// the parent page to start the rest timer.
// ===========================================================================
import { useState } from 'react'

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

  return (
    <div className={'card exercise' + (complete ? ' complete' : '')}>
      <div className="row between" style={{ alignItems: 'flex-start' }}>
        <div>
          <h3>{exercise.name}</h3>
          <div className="row wrap mt-s" style={{ gap: 8 }}>
            <span className={'pill ' + (exercise.type === 'compound' ? 'pill-accent' : '')}>
              {exercise.type}
            </span>
            <span className="pill">
              {exercise.sets} × {exercise.repLow}–{exercise.repHigh} {repUnit}
            </span>
            <span className="pill">rest {exercise.rest}s</span>
          </div>
        </div>
        <div className="center">
          <div className="big-num" style={{ fontSize: '1.5rem', color: complete ? 'var(--green)' : 'var(--text)' }}>
            {doneCount}/{exercise.sets}
          </div>
          <div className="stat-label">sets</div>
        </div>
      </div>

      {lastBest != null && (
        <div className="faint mt-s" style={{ fontSize: '0.8rem' }}>
          Last best: <span className="accent">{lastBest} kg</span> — try to match or beat it.
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
              placeholder="0"
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
