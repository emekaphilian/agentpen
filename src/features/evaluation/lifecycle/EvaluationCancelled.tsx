import type { EvaluationLifecycleState } from '../../../types'

interface EvaluationCancelledProps {
  lifecycle: EvaluationLifecycleState
}

export function EvaluationCancelled({ lifecycle }: EvaluationCancelledProps) {
  return (
    <div className="status-message">
      <p className="detail-label">Lifecycle outcome</p>
      <h2 className="system-name">Cancelled</h2>
      <p className="system-meta">The evaluation was stopped before completion.</p>
      <p className="system-meta">Progress: {lifecycle.progress}%</p>
    </div>
  )
}
