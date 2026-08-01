import type { EvaluationLifecycleState } from '../../../types'

interface EvaluationExecutionProps {
  lifecycle: EvaluationLifecycleState
}

export function EvaluationExecution({ lifecycle }: EvaluationExecutionProps) {
  return (
    <div className="status-message">
      <p className="detail-label">Execution</p>
      <h2 className="system-name">{lifecycle.currentStatus}</h2>
      <p className="system-meta">The evaluation is progressing through the assurance lifecycle and collecting evidence.</p>
    </div>
  )
}
