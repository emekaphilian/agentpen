import type { Evidence } from '../../types'

interface EvidenceSummaryProps {
  evidence: Evidence[]
}

export function EvidenceSummary({ evidence }: EvidenceSummaryProps) {
  return (
    <div className="status-message">
      <p className="detail-label">Evidence summary</p>
      <h2 className="system-name">{evidence.length} artifact{evidence.length === 1 ? '' : 's'}</h2>
      <p className="system-meta">The evidence pack captures findings, controls, observations, and test results across the assurance pillars.</p>
    </div>
  )
}
