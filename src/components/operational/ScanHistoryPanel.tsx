const historyItems = [
  {
    url: 'https://agent.example.com',
    scanId: 'scan-001',
    date: '2026-08-01 12:00:00',
    probes: 10,
    score: 78,
    band: 'HIGH'
  },
  {
    url: 'https://agent.example.com',
    scanId: 'scan-002',
    date: '2026-07-31 15:30:00',
    probes: 10,
    score: 54,
    band: 'MEDIUM'
  }
]

export default function ScanHistoryPanel() {
  return (
    <div className="view" id="view-history">
      <div className="empty" id="history-empty" style={{ display: 'none' }}>
        <div className="empty-icon">🕐</div>
        <p>Scan history will appear here.</p>
      </div>
      <div id="history-list">
        {historyItems.map((item) => {
          const color = item.band === 'CRITICAL' || item.band === 'HIGH' ? '#f87171' : item.band === 'MEDIUM' ? '#fbbf24' : '#4ade80'

          return (
            <div className="card history-card" key={item.scanId}>
              <div>
                <div className="history-url">{item.url}</div>
                <div className="history-meta">
                  {item.scanId} · {item.date} · {item.probes} probes
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 600, color }}>
                  {item.score}/100
                </div>
                <div style={{ fontSize: '11px', color }}>{item.band}</div>
                <div style={{ marginTop: '4px', fontSize: '11px', color: '#f87171' }}>
                  4 vulnerable
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
