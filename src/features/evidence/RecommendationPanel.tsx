import type { Evidence } from '../../types'

interface RecommendationPanelProps {
  evidence: Evidence[]
}

export function RecommendationPanel({ evidence }: RecommendationPanelProps) {
  const recommendations = evidence.flatMap((item) => item.recommendations)

  return (
    <div className="finding-list">
      {recommendations.map((item) => (
        <div key={item.id} className="card" style={{ marginBottom: '0.75rem' }}>
          <div className="system-name">{item.title}</div>
          <div className="system-meta">{item.description}</div>
          <div className="system-meta">Priority: {item.priority}</div>
        </div>
      ))}
    </div>
  )
}
