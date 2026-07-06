// ===========================================================================
// RestTimer — a sticky countdown bar shown above the bottom navigation.
// The Workout page starts it (with a fresh `token`) each time you tick a set
// "done". It counts down, beeps at zero, and can be extended or skipped.
// ===========================================================================
import { useEffect, useRef, useState } from 'react'

// A short beep using the browser's built-in Web Audio — no sound files needed.
function beep() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) return
    const ctx = new Ctx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.value = 880
    gain.gain.setValueAtTime(0.001, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
    osc.start()
    osc.stop(ctx.currentTime + 0.52)
    setTimeout(() => ctx.close(), 800)
  } catch (e) {
    /* ignore — sound is a nice-to-have */
  }
}

export default function RestTimer({ active, onDismiss }) {
  // `active` looks like { token, seconds, label }. A new token restarts.
  const [remaining, setRemaining] = useState(0)
  const [total, setTotal] = useState(0)
  const intervalRef = useRef(null)
  const beepedRef = useRef(false)

  // Restart the countdown whenever a new timer (new token) arrives.
  useEffect(() => {
    if (!active) return
    setRemaining(active.seconds)
    setTotal(active.seconds)
    beepedRef.current = false
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active?.token])

  // The ticking clock.
  useEffect(() => {
    if (!active) return
    clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(intervalRef.current)
          if (!beepedRef.current) {
            beep()
            beepedRef.current = true
          }
          return 0
        }
        return r - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active?.token])

  if (!active) return null

  const mins = Math.floor(remaining / 60)
  const secs = remaining % 60
  const pct = total ? ((total - remaining) / total) * 100 : 100
  const done = remaining === 0

  return (
    <div className="rest-timer" role="timer" aria-live="polite">
      <div className="rest-bar">
        <span style={{ width: `${pct}%` }} />
      </div>
      <div className="rest-inner">
        <div className="rest-left">
          <div className="stat-label">{done ? 'Rest over — go!' : 'Rest'}</div>
          <div className="rest-time" style={{ color: done ? 'var(--green)' : 'var(--accent)' }}>
            {mins}:{String(secs).padStart(2, '0')}
          </div>
          <div className="faint" style={{ fontSize: '0.75rem' }}>
            {active.label}
          </div>
        </div>
        <div className="row">
          <button
            className="btn btn-sm"
            onClick={() => setRemaining((r) => r + 30)}
          >
            +30s
          </button>
          <button className="btn btn-sm btn-primary" onClick={onDismiss}>
            {done ? 'Done' : 'Skip'}
          </button>
        </div>
      </div>
    </div>
  )
}
