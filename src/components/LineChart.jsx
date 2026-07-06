// ===========================================================================
// LineChart — a small, dependency-free line chart drawn with plain SVG.
// Give it an array of points: [{ x: 'label', y: number }, …].
// It draws an amber line, soft gradient fill, dots, and simple axis labels.
// Being hand-built keeps the app tiny and lets it match our theme exactly.
// ===========================================================================
import { useMemo } from 'react'

export default function LineChart({
  points = [],
  height = 180,
  unit = '',
  color = '#f5b841',
  target = null, // optional horizontal reference line { value, label }
}) {
  const W = 320 // internal drawing width; SVG scales to fit its container
  const H = height
  const padL = 34
  const padR = 12
  const padT = 14
  const padB = 26

  const geometry = useMemo(() => {
    if (points.length === 0) return null

    const ys = points.map((p) => p.y)
    let min = Math.min(...ys)
    let max = Math.max(...ys)
    if (target != null) {
      min = Math.min(min, target.value)
      max = Math.max(max, target.value)
    }
    // Add a little breathing room above/below.
    const span = max - min || 1
    min -= span * 0.12
    max += span * 0.12

    const innerW = W - padL - padR
    const innerH = H - padT - padB

    const xFor = (i) =>
      padL + (points.length === 1 ? innerW / 2 : (i / (points.length - 1)) * innerW)
    const yFor = (v) => padT + innerH - ((v - min) / (max - min)) * innerH

    const coords = points.map((p, i) => ({ x: xFor(i), y: yFor(p.y), p }))
    const linePath = coords
      .map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`)
      .join(' ')
    const areaPath =
      `${linePath} L ${coords[coords.length - 1].x.toFixed(1)} ${H - padB} ` +
      `L ${coords[0].x.toFixed(1)} ${H - padB} Z`

    // A few y-axis gridline values.
    const ticks = [min + (max - min) * 0.15, (min + max) / 2, max - (max - min) * 0.15]

    return { coords, linePath, areaPath, yFor, min, max, ticks }
  }, [points, H, target])

  if (!geometry) {
    return (
      <div className="empty">
        <div className="icon">📈</div>
        <div>No data yet — log a few entries and your trend appears here.</div>
      </div>
    )
  }

  const { coords, linePath, areaPath, yFor, ticks } = geometry
  const gradId = 'g-' + color.replace('#', '')

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height={H}
      preserveAspectRatio="none"
      role="img"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* horizontal gridlines + y labels */}
      {ticks.map((t, i) => (
        <g key={i}>
          <line
            x1={padL}
            x2={W - padR}
            y1={yFor(t)}
            y2={yFor(t)}
            stroke="#222932"
            strokeWidth="1"
          />
          <text x={4} y={yFor(t) + 3} fill="#616e7c" fontSize="9">
            {Math.round(t)}
          </text>
        </g>
      ))}

      {/* optional target line */}
      {target != null && (
        <line
          x1={padL}
          x2={W - padR}
          y1={yFor(target.value)}
          y2={yFor(target.value)}
          stroke="#3fb950"
          strokeWidth="1"
          strokeDasharray="4 3"
          opacity="0.7"
        />
      )}

      {/* filled area + line */}
      <path d={areaPath} fill={`url(#${gradId})`} />
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* dots */}
      {coords.map((c, i) => (
        <circle key={i} cx={c.x} cy={c.y} r="3" fill={color} stroke="#0d1117" strokeWidth="1.5" />
      ))}

      {/* x labels — show first, middle, last to avoid crowding */}
      {coords.map((c, i) => {
        const show =
          i === 0 || i === coords.length - 1 || i === Math.floor(coords.length / 2)
        if (!show) return null
        return (
          <text
            key={i}
            x={c.x}
            y={H - 8}
            fill="#616e7c"
            fontSize="9"
            textAnchor="middle"
          >
            {c.p.x}
          </text>
        )
      })}
    </svg>
  )
}
