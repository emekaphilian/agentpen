import type { EvaluationLifecycleState } from '../../../types'

interface EvaluationStatusTimelineProps {
  lifecycle: EvaluationLifecycleState
}

export function EvaluationStatusTimeline({ lifecycle }: EvaluationStatusTimelineProps) {
  return (
    <div className="finding-list">
      {lifecycle.steps.map((step) => (
        <div key={step.key} className="card" style={{ marginBottom: '0.75rem' }}>
          <div className="system-name">{step.title}</div>
          <div className="system-meta">{step.description}</div>
          <div className="system-meta">
            {step.completed ? 'Completed' : step.key === lifecycle.currentStatus ? 'In progress' : 'Pending'}
          </div>
        </div>
      ))}
    </div>
  )
}
