import type { AssuranceReport } from '../../types'

interface RecommendationsSectionProps {
  report: AssuranceReport
}

export function RecommendationsSection({ report }: RecommendationsSectionProps) {
  return (
    <div className="card" style={{ padding: '1.25rem' }}>
      <div className="detail-label">Recommendations</div>
      <div className="finding-list">
        {report.recommendations.map((item) => (
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
