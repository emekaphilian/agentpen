import type { EvaluationLifecycleState } from '../../../types'

interface EvaluationQueueProps {
  lifecycle: EvaluationLifecycleState
}

export function EvaluationQueue({ lifecycle }: EvaluationQueueProps) {
  return (
    <div className="status-message">
      <p className="detail-label">Lifecycle stage</p>
      <h2 className="system-name">Queued</h2>
      <div className="progress-bar" aria-label="Evaluation lifecycle progress">
        <div className="progress-fill" style={{ width: `${Math.max(lifecycle.progress, 8)}%` }} />
      </div>
      <p style={{ marginTop: '0.75rem' }}>{lifecycle.progress}% complete</p>
    </div>
  )
}
