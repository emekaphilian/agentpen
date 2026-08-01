interface ReportActionsProps {
  reportId?: string
}

export function ReportActions({ reportId }: ReportActionsProps) {
  return (
    <div className="card" style={{ padding: '1.25rem' }}>
      <div className="detail-label">Report actions</div>
      <div className="finding-list">
        <button className="button" type="button" disabled={!reportId}>
          Download report
        </button>
        <button className="button secondary" type="button" style={{ marginLeft: '0.75rem' }}>
          Share report
        </button>
      </div>
    </div>
  )
}
