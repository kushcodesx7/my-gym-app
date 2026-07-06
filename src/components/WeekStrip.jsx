// ===========================================================================
// WeekStrip — the 7-day consistency row (like Hevy's calendar). Each day of
// the current week shows: done (amber, ✓), today (glowing ring), upcoming
// (dim letter), or rest day (moon). Seeing filled dots build up across the
// week is a powerful "don't break the chain" motivator.
// ===========================================================================
import { toKey } from '../lib/date'
import { WEEK_SCHEDULE } from '../lib/workoutPlan'
import { sessionHasWork } from '../lib/calc'

const LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export default function WeekStrip({ workouts }) {
  const now = new Date()
  const todayIdx = now.getDay() // 0=Sun
  // Build the week starting Monday (idx 1) through Sunday.
  const order = [1, 2, 3, 4, 5, 6, 0]

  return (
    <div className="week-strip">
      {order.map((dow) => {
        // Date for this weekday within the current week.
        const d = new Date(now)
        const diff = ((dow === 0 ? 7 : dow) - (todayIdx === 0 ? 7 : todayIdx))
        d.setDate(now.getDate() + diff)
        const key = toKey(d)
        const trained = sessionHasWork(workouts[key])
        const isToday = dow === todayIdx
        const isRest = WEEK_SCHEDULE[dow] === 'Rest'
        const isPast = diff < 0

        let cls = 'week-day'
        if (trained) cls += ' trained'
        else if (isRest) cls += ' rest'
        else if (isPast) cls += ' missed'
        if (isToday) cls += ' today'

        return (
          <div className={cls} key={dow}>
            <span className="week-dot">
              {trained ? '✓' : isRest ? '☾' : LETTERS[dow]}
            </span>
            <span className="week-plan">{isRest ? 'Rest' : WEEK_SCHEDULE[dow]}</span>
          </div>
        )
      })}
    </div>
  )
}
