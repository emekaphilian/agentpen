import type { Evaluation } from '../../types'
import { EvaluationResults } from '../../features/evaluation/EvaluationResults'

interface ResultsPanelProps {
  evaluation: Evaluation | null
}

export default function ResultsPanel({ evaluation }: ResultsPanelProps) {
  if (!evaluation) {
    return (
      <div className="view" id="view-results">
        <div className="empty" id="results-empty">
          <div className="empty-icon">📋</div>
          <p>No evaluation results yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="view" id="view-results">
      <EvaluationResults evaluation={evaluation} />
    </div>
  )
}
