import type { EvaluationLifecycleState } from '../../../types'

interface EvaluationFailedProps {
  lifecycle: EvaluationLifecycleState
}

export function EvaluationFailed({ lifecycle }: EvaluationFailedProps) {
  return (
    <div className="status-message error">
      <p className="detail-label">Lifecycle outcome</p>
      <h2 className="system-name">Failed</h2>
      <p className="system-meta">The evaluation did not complete successfully and needs attention.</p>
      <p className="system-meta">Progress: {lifecycle.progress}%</p>
    </div>
  )
}
