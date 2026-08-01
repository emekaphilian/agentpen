interface EvaluationProgressProps {
  progress: number
  status: string
}

export function EvaluationProgress({ progress, status }: EvaluationProgressProps) {
  return (
    <div className="status-message">
      <p className="detail-label">Evaluation status</p>
      <h2 className="system-name">{status}</h2>
      <div className="progress-bar" aria-label="Evaluation progress">
        <div className="progress-fill" style={{ width: `${Math.max(progress, 6)}%` }} />
      </div>
      <p style={{ marginTop: '0.75rem' }}>{progress}% complete</p>
    </div>
  )
}
