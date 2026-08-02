interface ReportActionsProps {
  reportId?: string
}

export function ReportActions({ reportId }: ReportActionsProps) {
  return (
    <div className="card" style={{ padding: '1.25rem' }}>
      <div className="detail-label">Report actions</div>
      <div className="finding-list" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button className="button" type="button" disabled={!reportId}>
          Download report
        </button>
        <button className="button secondary" type="button">
          Export JSON
        </button>
        <button className="button secondary" type="button">
          Export PDF
        </button>
        <button className="button secondary" type="button">
          Duplicate report
        </button>
        <button className="button secondary" type="button">
          Archive report
        </button>
      </div>
    </div>
  )
}
