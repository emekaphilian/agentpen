import type { AssuranceResult } from '../../types'

interface RecommendationSummaryProps {
  result: AssuranceResult
}

export function RecommendationSummary({ result }: RecommendationSummaryProps) {
  return (
    <div className="card" style={{ padding: '1.25rem' }}>
      <div className="detail-label">Recommendation focus</div>
      <div className="finding-list">
        {result.recommendations.map((item) => (
          <div key={item.id} className="card" style={{ marginBottom: '0.75rem' }}>
            <div className="system-name">{item.title}</div>
            <div className="system-meta">{item.description}</div>
            <div className="system-meta">Priority: {item.priority}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
