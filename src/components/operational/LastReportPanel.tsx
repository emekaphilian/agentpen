import type { Evaluation } from '../../types'

interface ReportItem {
  title: string
  description: string
  priority: string
}

interface LastReportPanelProps {
  report: {
    evaluationId: string
    targetSystem: string
    modelVersion: string
    timestamp: string
    evidenceSummary: string
    assuranceScores: {
      security: number
      safety: number
      reliability: number
      fairness: number
      domain: number
      overall: number
    }
    recommendations: ReportItem[]
    exportOptions: string[]
  } | null
  evaluation: Evaluation | null
}

export default function LastReportPanel({ report, evaluation }: LastReportPanelProps) {
  if (!report || !evaluation) {
    return (
      <div className="view" id="view-report">
        <div className="empty" id="report-empty">
          <div className="empty-icon">📄</div>
          <p>No assurance report yet. Run an evaluation to generate one.</p>
        </div>
      </div>
    )
  }

  const accentColor = report.assuranceScores.overall >= 75 ? '#4ade80' : report.assuranceScores.overall >= 60 ? '#fbbf24' : '#f87171'

  return (
    <div className="view" id="view-report">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <div className="card-title" style={{ marginBottom: 4 }}>
              Assurance report
            </div>
            <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
              Evaluation ID: {report.evaluationId} · Timestamp: {new Date(report.timestamp).toLocaleString()}
            </div>
          </div>
          <div className="badge" style={{ background: 'rgba(99,102,241,0.08)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)' }}>
            Signed report
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '1rem' }}>
          <div style={{ background: 'var(--bg3)', borderRadius: '8px', padding: '0.875rem', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Overall score</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 600, color: accentColor }}>{report.assuranceScores.overall}/100</div>
            <div style={{ fontSize: '11px', color: accentColor }}>Overall assurance</div>
          </div>
          <div style={{ background: 'var(--bg3)', borderRadius: '8px', padding: '0.875rem', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Target system</div>
            <div style={{ fontSize: '1rem', fontWeight: 600 }}>{report.targetSystem}</div>
            <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{report.modelVersion}</div>
          </div>
          <div style={{ background: 'var(--bg3)', borderRadius: '8px', padding: '0.875rem', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Evidence summary</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>{report.evidenceSummary}</div>
          </div>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '12px', fontWeight: 500, marginBottom: '8px' }}>Assurance scores</div>
          <div className="pillar-list">
            {Object.entries(report.assuranceScores).filter(([key]) => key !== 'overall').map(([key, score]) => (
              <span key={key} className="pillar-chip active">
                {key}: {score}/100
              </span>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '12px', fontWeight: 500, marginBottom: '8px' }}>Export options</div>
          <div className="pillar-list">
            {report.exportOptions.map((option) => (
              <span key={option} className="pillar-chip">
                {option}
              </span>
            ))}
          </div>
        </div>
        <div>
          {report.recommendations.map((item) => (
            <div className="finding-row" key={item.title}>
              <div className="finding-header">
                <span style={{ fontWeight: 500 }}>{item.title}</span>
                <span className={`badge ${item.priority === 'high' ? 'badge-critical' : item.priority === 'medium' ? 'badge-medium' : 'badge-low'}`}>{item.priority.toUpperCase()}</span>
              </div>
              <div className="finding-body open">
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
