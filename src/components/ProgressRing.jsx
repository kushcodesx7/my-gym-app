// ===========================================================================
// ProgressRing — a circular progress meter drawn with SVG. Used on the Diet
// page to show protein-so-far vs your daily target. Turns green once you hit
// the target range.
// ===========================================================================

export default function ProgressRing({
  value = 0,
  target = 100,
  size = 150,
  stroke = 12,
  label = '',
  sublabel = '',
  unit = 'g',
}) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const pct = Math.max(0, Math.min(1, target ? value / target : 0))
  const dash = circumference * pct
  const hitTarget = value >= target
  const color = hitTarget ? '#3fb950' : '#f5b841'

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1c232d"
          strokeWidth={stroke}
        />
        {/* progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          style={{ transition: 'stroke-dasharray 0.5s ease, stroke 0.3s ease' }}
        />
      </svg>
      {/* center text — sits on top of the ring */}
      <div style={{ marginTop: -size / 2 - 8, textAlign: 'center', pointerEvents: 'none' }}>
        <div className="big-num" style={{ color }}>
          {Math.round(value)}
          <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>{unit}</span>
        </div>
        {label && <div className="stat-label" style={{ marginTop: 4 }}>{label}</div>}
        {sublabel && (
          <div className="faint" style={{ fontSize: '0.72rem', marginTop: 2 }}>
            {sublabel}
          </div>
        )}
      </div>
      <div style={{ height: size / 2 - 8 }} />
    </div>
  )
}
