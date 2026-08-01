import type { AssuranceReport } from '../../types'

interface ExecutiveSummaryProps {
  report: AssuranceReport
}

export function ExecutiveSummary({ report }: ExecutiveSummaryProps) {
  return (
    <div className="status-message">
      <p className="detail-label">Executive summary</p>
      <h2 className="system-name">{report.executiveSummary.headline}</h2>
      <p className="system-meta">{report.executiveSummary.overview}</p>
      <ul className="finding-list" style={{ marginTop: '0.75rem' }}>
        {report.executiveSummary.highlights.map((item) => (
          <li key={item} className="system-meta">• {item}</li>
        ))}
      </ul>
    </div>
  )
}
