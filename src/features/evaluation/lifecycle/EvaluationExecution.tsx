import type { EvaluationLifecycleState } from '../../../types'

interface EvaluationExecutionProps {
  lifecycle: EvaluationLifecycleState
}

export function EvaluationExecution({ lifecycle }: EvaluationExecutionProps) {
  return (
    <div className="status-message">
      <p className="detail-label">Lifecycle stage</p>
      <h2 className="system-name">Evaluation in progress</h2>
      <p className="system-meta">The evaluation is progressing through discovery, adversarial testing, evidence collection, and assurance scoring.</p>
    </div>
  )
}
