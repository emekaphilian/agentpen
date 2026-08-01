import type { AssuranceCategory, AssuranceReport } from '../../types'

interface AssuranceScoreSectionProps {
  report: AssuranceReport
}

function formatPercent(value: number) {
  return `${value.toFixed(0)}%`
}

export function AssuranceScoreSection({ report }: AssuranceScoreSectionProps) {
  const pillars = Object.values(report.pillars) as AssuranceCategory[]

  return (
    <div className="card" style={{ padding: '1.25rem' }}>
      <div className="detail-label">Assurance scores</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <div style={{ fontSize: '2rem', fontWeight: 700 }}>{report.overallScore}/100</div>
        <span className="badge" style={{ textTransform: 'capitalize' }}>{report.riskLevel}</span>
      </div>
      <div className="finding-list">
        {pillars.map((pillar) => (
          <div key={pillar.name} className="card" style={{ marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div className="system-name">{pillar.name}</div>
                <div className="system-meta">Raw {formatPercent(pillar.rawScore)} · Weighted {formatPercent(pillar.weightedScore)}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="system-name">{formatPercent(pillar.weightedScore)}</div>
                <div className="system-meta">Confidence {Math.round(pillar.confidence * 100)}%</div>
              </div>
            </div>
            <div className="system-meta" style={{ marginTop: '0.5rem' }}>
              Risk {pillar.riskLevel} · Trend {pillar.trend}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
