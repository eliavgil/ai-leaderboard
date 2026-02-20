export default function Sparkline({ data, width = 64, height = 24 }) {
  if (!data || data.length < 2) return null

  const values = data.map(d => d.score)
  const max = Math.max(...values, 1)
  const min = Math.min(...values, 0)
  const range = max - min || 1

  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * width
    const y = height - ((v - min) / range) * height
    return `${x},${y}`
  })

  return (
    <svg
      width={width}
      height={height}
      className="opacity-70"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sparkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#b000ff" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#00f5ff" stopOpacity="1" />
        </linearGradient>
      </defs>
      <polyline
        fill="none"
        stroke="url(#sparkGrad)"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        points={pts.join(' ')}
      />
      {/* Last point dot */}
      {(() => {
        const last = pts[pts.length - 1].split(',')
        return (
          <circle
            cx={parseFloat(last[0])}
            cy={parseFloat(last[1])}
            r="2"
            fill="#00f5ff"
          />
        )
      })()}
    </svg>
  )
}
