import type { AssuranceResult } from '../../types'

interface AssuranceSummaryProps {
  result: AssuranceResult
}

export function AssuranceSummary({ result }: AssuranceSummaryProps) {
  return (
    <div className="status-message">
      <p className="detail-label">Assurance summary</p>
      <h2 className="system-name">{result.overallScore}/100 overall assurance</h2>
      <p className="system-meta">The score engine combines evidence quality, control coverage, and observed risk across the five assurance pillars.</p>
      <p className="system-meta">Risk classification: {result.riskLevel}</p>
      <p className="system-meta">Confidence: {result.confidence}%</p>
      <p className="system-meta">Deployment decision: {result.deploymentDecision.label}</p>
    </div>
  )
}
