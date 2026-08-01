import type { AssuranceCategory, AssuranceResult } from '../../types'

interface AssuranceRadarProps {
  result: AssuranceResult
}

function polarToCartesian(cx: number, cy: number, r: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0
  return {
    x: cx + r * Math.cos(angleInRadians),
    y: cy + r * Math.sin(angleInRadians)
  }
}

function describePolygon(points: Array<{ x: number; y: number }>) {
  return points.map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(' ')
}

export function AssuranceRadar({ result }: AssuranceRadarProps) {
  const size = 220
  const center = size / 2
  const radius = 80
  const categories = result.categories

  const points = categories.map((category: AssuranceCategory, index: number) => {
    const angle = (360 / categories.length) * index
    const point = polarToCartesian(center, center, radius * (category.weightedScore / 100), angle)
    return point
  })

  const polygon = describePolygon(points)

  return (
    <div className="card" style={{ padding: '1.25rem' }}>
      <div className="detail-label">Assurance radar</div>
      <svg viewBox={`0 0 ${size} ${size}`} width="100%" height="220" role="img" aria-label="Assurance radar chart">
        <circle cx={center} cy={center} r={radius} fill="none" stroke="var(--color-border)" />
        <circle cx={center} cy={center} r={radius * 0.5} fill="none" stroke="var(--color-border)" />
        <circle cx={center} cy={center} r={radius * 0.25} fill="none" stroke="var(--color-border)" />
        <polygon points={polygon} fill="rgba(37, 99, 235, 0.25)" stroke="#2563eb" strokeWidth="2" />
        {points.map((point, index) => {
          const labelAngle = (360 / categories.length) * index
          const labelPoint = polarToCartesian(center, center, radius + 18, labelAngle)
          return (
            <g key={categories[index].name}>
              <circle cx={point.x} cy={point.y} r="4" fill="#2563eb" />
              <text x={labelPoint.x} y={labelPoint.y} textAnchor="middle" fontSize="10" fill="var(--color-text-muted)">{categories[index].name}</text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
