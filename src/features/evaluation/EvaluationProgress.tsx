import type { EvaluationLifecycleState } from '../../types'
import { EvaluationStatusTimeline } from './lifecycle/EvaluationStatusTimeline'

interface EvaluationProgressProps {
  progress: number
  status: string
  lifecycle: EvaluationLifecycleState
}

export function EvaluationProgress({ progress, status, lifecycle }: EvaluationProgressProps) {
  const currentStep = lifecycle.steps.find((step) => step.key === lifecycle.currentStatus)
  return (
    <div className="status-message">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="detail-label">Evaluation status</p>
          <h2 className="system-name">{status}</h2>
        </div>
        <span className={`badge ${lifecycle.currentStatus === 'Completed' ? 'badge-success' : lifecycle.currentStatus === 'Failed' || lifecycle.currentStatus === 'Cancelled' ? 'badge-error' : 'badge-warning'}`}>
          {lifecycle.currentStatus}
        </span>
      </div>

      <div className="progress-bar" aria-label="Evaluation progress">
        <div className="progress-fill" style={{ width: `${Math.max(progress, 6)}%` }} />
      </div>
      <p style={{ marginTop: '0.75rem' }}>{progress}% complete</p>

      {currentStep ? (
        <div className="stage-summary" style={{ marginTop: '1rem' }}>
          <p className="detail-label">Current stage</p>
          <p className="system-name">{currentStep.title}</p>
          <p className="system-meta">{currentStep.description}</p>
        </div>
      ) : null}

      <div className="stage-timeline" style={{ marginTop: '1.5rem' }}>
        <p className="detail-label">Progress stages</p>
        <EvaluationStatusTimeline lifecycle={lifecycle} />
      </div>
    </div>
  )
}
