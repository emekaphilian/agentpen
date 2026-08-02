import type { Evaluation } from '../../types'

interface ScanHistoryPanelProps {
  history: Evaluation[]
}

export default function ScanHistoryPanel({ history }: ScanHistoryPanelProps) {
  if (history.length === 0) {
    return (
      <div className="view" id="view-history">
        <div className="empty" id="history-empty">
          <div className="empty-icon">🕐</div>
          <p>Evaluation history will appear here.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="view" id="view-history">
      <div id="history-list">
        {history.map((item) => {
          const color = item.assuranceScore.overall >= 75 ? '#4ade80' : item.assuranceScore.overall >= 60 ? '#fbbf24' : '#f87171'

          return (
            <div className="card history-card" key={item.id}>
              <div>
                <div className="history-url">{item.aiSystemName}</div>
                <div className="history-meta">
                  {item.id} · {new Date(item.createdAt).toLocaleString()} · {item.pillars.length} pillars
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 600, color }}>
                  {item.assuranceScore.overall}/100
                </div>
                <div style={{ fontSize: '11px', color }}>{item.status}</div>
                <div style={{ marginTop: '4px', fontSize: '11px', color: '#818cf8' }}>
                  {item.modelVersion}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
