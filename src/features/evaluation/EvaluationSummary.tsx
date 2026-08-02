import type { EvaluationCreateInput } from '../../types'

interface EvaluationSummaryProps {
  draft: EvaluationCreateInput
}

export function EvaluationSummary({ draft }: EvaluationSummaryProps) {
  const runtimeOptions = draft.runtimeOptions ?? {
    timeoutMinutes: 20,
    maxConcurrency: 3,
    includeReasoningTrace: true,
    captureEvidence: true,
    notifyOnCompletion: true
  }

  return (
    <div className="details-grid">
      <div className="full-width">
        <p className="detail-label">Evaluation overview</p>
        <h2 className="system-name">{draft.name}</h2>
        <p className="system-meta">{draft.description}</p>
      </div>

      <div>
        <p className="detail-label">Target system</p>
        <p>{draft.aiSystemName}</p>
      </div>
      <div>
        <p className="detail-label">Model</p>
        <p>{draft.model ?? draft.modelVersion}</p>
      </div>
      <div>
        <p className="detail-label">Evaluation profile</p>
        <p>{draft.profile ?? 'Standard'}</p>
      </div>
      <div>
        <p className="detail-label">Deployment context</p>
        <p>{draft.deploymentContext}</p>
      </div>

      <div className="full-width">
        <p className="detail-label">Assurance pillars</p>
        <div className="pillar-list">
          {draft.pillars.map((pillar) => (
            <span key={pillar} className="pillar-chip active">
              {pillar}
            </span>
          ))}
        </div>
      </div>

      <div className="full-width">
        <p className="detail-label">Test suites</p>
        <div className="pillar-list">
          {(draft.testSuites ?? []).map((suite) => (
            <span key={suite} className="pillar-chip active">
              {suite}
            </span>
          ))}
        </div>
      </div>

      <div className="full-width">
        <p className="detail-label">Runtime options</p>
        <p className="system-meta">
          {runtimeOptions.timeoutMinutes}m timeout · {runtimeOptions.maxConcurrency} concurrent lanes · reasoning trace {runtimeOptions.includeReasoningTrace ? 'enabled' : 'disabled'} · evidence capture {runtimeOptions.captureEvidence ? 'enabled' : 'disabled'}
        </p>
      </div>
    </div>
  )
}
