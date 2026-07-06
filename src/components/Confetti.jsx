// ===========================================================================
// Confetti — a pure-CSS celebration burst shown when you complete a session.
// 40 little squares rain down once. No libraries, costs ~0 KB.
// ===========================================================================

const COLORS = ['#f5b841', '#ff9f1c', '#3fb950', '#58a6ff', '#e6edf3']

export default function Confetti() {
  const pieces = Array.from({ length: 40 }, (_, i) => i)
  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((i) => (
        <span
          key={i}
          style={{
            left: `${(i * 53) % 100}%`,
            background: COLORS[i % COLORS.length],
            animationDelay: `${(i % 10) * 0.12}s`,
            animationDuration: `${2 + (i % 5) * 0.35}s`,
            width: 6 + (i % 3) * 3,
            height: 10 + (i % 4) * 3,
          }}
        />
      ))}
    </div>
  )
}
