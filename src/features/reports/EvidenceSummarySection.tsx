import type { AssuranceReport } from '../../types'

interface EvidenceSummarySectionProps {
  report: AssuranceReport
}

export function EvidenceSummarySection({ report }: EvidenceSummarySectionProps) {
  return (
    <div className="card" style={{ padding: '1.25rem' }}>
      <div className="detail-label">Evidence summary</div>
      <div className="details-grid">
        <div>
          <div className="system-meta">Artifacts collected</div>
          <div className="system-name">{report.evidenceSummary.totalArtifacts}</div>
        </div>
        <div>
          <div className="system-meta">High-severity findings</div>
          <div className="system-name">{report.evidenceSummary.highSeverityCount}</div>
        </div>
        <div>
          <div className="system-meta">Average confidence</div>
          <div className="system-name">{Math.round(report.evidenceSummary.averageConfidence * 100)}%</div>
        </div>
        <div>
          <div className="system-meta">Coverage</div>
          <div className="system-name">{report.evidenceSummary.coverage}%</div>
        </div>
      </div>
    </div>
  )
}
