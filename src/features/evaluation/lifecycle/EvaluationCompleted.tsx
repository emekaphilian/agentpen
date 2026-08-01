import type { EvaluationLifecycleState } from '../../../types'

interface EvaluationCompletedProps {
  lifecycle: EvaluationLifecycleState
}

export function EvaluationCompleted({ lifecycle }: EvaluationCompletedProps) {
  return (
    <div className="status-message">
      <p className="detail-label">Lifecycle outcome</p>
      <h2 className="system-name">Completed</h2>
      <p className="system-meta">The evaluation finished successfully and the report is ready for review.</p>
      <p className="system-meta">Progress: {lifecycle.progress}%</p>
    </div>
  )
}
