import type { AssuranceResult } from '../../types'

interface AssuranceScoreCardProps {
  result: AssuranceResult
}

export function AssuranceScoreCard({ result }: AssuranceScoreCardProps) {
  return (
    <div className="card" style={{ padding: '1.25rem' }}>
      <div className="detail-label">Overall assurance</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ fontSize: '2.2rem', fontWeight: 700 }}>{result.overallScore}/100</div>
        <span className="badge" style={{ textTransform: 'capitalize' }}>{result.riskLevel}</span>
      </div>
      <p className="system-meta" style={{ marginTop: '0.75rem' }}>
        {result.summary}
      </p>
    </div>
  )
}
