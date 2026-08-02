import type { AssuranceCategory, AssuranceResult } from '../../types'

interface AssuranceBreakdownProps {
  result: AssuranceResult
}

function formatPercent(value: number) {
  return `${value.toFixed(0)}%`
}

export function AssuranceBreakdown({ result }: AssuranceBreakdownProps) {
  return (
    <div className="card" style={{ padding: '1.25rem' }}>
      <div className="detail-label">Pillar breakdown</div>
      <div className="finding-list">
        {result.categories.map((category: AssuranceCategory) => (
          <div key={category.name} className="card" style={{ marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
              <div>
                <div className="system-name">{category.name}</div>
                <div className="system-meta">Raw {formatPercent(category.rawScore)} · Weighted {formatPercent(category.weightedScore)}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="system-name">{formatPercent(category.weightedScore)}</div>
                <div className="system-meta">Confidence {Math.round(category.confidence * 100)}%</div>
              </div>
            </div>
            <div className="system-meta" style={{ marginTop: '0.5rem' }}>
              Risk {category.riskLevel} · Trend {category.trend} · Evidence support {Math.round(category.confidence * 100)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
