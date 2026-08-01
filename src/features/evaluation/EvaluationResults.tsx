import type { Evaluation } from '../../types'

interface EvaluationResultsProps {
  evaluation: Evaluation
}

export function EvaluationResults({ evaluation }: EvaluationResultsProps) {
  return (
    <div className="details-grid">
      <div className="full-width">
        <p className="detail-label">Result</p>
        <h2 className="system-name">{evaluation.name}</h2>
        <p className="system-meta">{evaluation.summary}</p>
      </div>

      <div>
        <p className="detail-label">Status</p>
        <p>{evaluation.status}</p>
      </div>
      <div>
        <p className="detail-label">Score</p>
        <p>{evaluation.assuranceScore.overall}/100</p>
      </div>
      <div>
        <p className="detail-label">AI system</p>
        <p>{evaluation.aiSystemName}</p>
      </div>
      <div>
        <p className="detail-label">Deployment context</p>
        <p>{evaluation.deploymentContext}</p>
      </div>

      <div className="full-width">
        <p className="detail-label">Pillars</p>
        <div className="pillar-list">
          {evaluation.pillars.map((pillar) => (
            <span key={pillar} className="pillar-chip active">
              {pillar}
            </span>
          ))}
        </div>
      </div>

      <div className="full-width">
        <p className="detail-label">Evidence</p>
        <div className="finding-list">
          {evaluation.evidence.map((item) => (
            <div key={item.id} className="card" style={{ marginBottom: '0.75rem' }}>
              <div className="system-name">{item.title}</div>
              <div className="system-meta">{item.description}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="full-width">
        <p className="detail-label">Recommendations</p>
        <div className="finding-list">
          {evaluation.recommendations.map((item) => (
            <div key={item.id} className="card" style={{ marginBottom: '0.75rem' }}>
              <div className="system-name">{item.title}</div>
              <div className="system-meta">{item.description}</div>
              <div className="system-meta">Priority: {item.priority}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
