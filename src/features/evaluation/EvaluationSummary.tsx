import type { EvaluationCreateInput } from '../../types'

interface EvaluationSummaryProps {
  draft: EvaluationCreateInput
}

export function EvaluationSummary({ draft }: EvaluationSummaryProps) {
  return (
    <div className="details-grid">
      <div className="full-width">
        <p className="detail-label">Evaluation overview</p>
        <h2 className="system-name">{draft.name}</h2>
        <p className="system-meta">{draft.description}</p>
      </div>

      <div>
        <p className="detail-label">AI system</p>
        <p>{draft.aiSystemName}</p>
      </div>
      <div>
        <p className="detail-label">AI system ID</p>
        <p>{draft.aiSystemId}</p>
      </div>
      <div>
        <p className="detail-label">Model version</p>
        <p>{draft.modelVersion}</p>
      </div>
      <div>
        <p className="detail-label">Deployment context</p>
        <p>{draft.deploymentContext}</p>
      </div>

      <div className="full-width">
        <p className="detail-label">Pillars to evaluate</p>
        <div className="pillar-list">
          {draft.pillars.map((pillar) => (
            <span key={pillar} className="pillar-chip active">
              {pillar}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
