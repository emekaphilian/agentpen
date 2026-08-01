import type { AssuranceReport } from '../../types'

interface FindingsSectionProps {
  report: AssuranceReport
}

export function FindingsSection({ report }: FindingsSectionProps) {
  return (
    <div className="card" style={{ padding: '1.25rem' }}>
      <div className="detail-label">Key findings</div>
      <div className="finding-list">
        {report.findings.map((finding) => (
          <div key={finding.id} className="card" style={{ marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
              <div className="system-name">{finding.title}</div>
              <span className="badge" style={{ textTransform: 'capitalize' }}>{finding.severity}</span>
            </div>
            <div className="system-meta">Pillar: {finding.pillar}</div>
            <div className="system-meta">{finding.summary}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
