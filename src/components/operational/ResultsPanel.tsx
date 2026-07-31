interface ResultsPanelProps {
  score?: string | number
  band?: string
  description?: string
  vulnerable?: string | number
  inconclusive?: string | number
  resistant?: string | number
}

export default function ResultsPanel({
  score = 78,
  band = 'HIGH',
  description = 'Multiple probe paths exceeded expected safeguards.',
  vulnerable = 4,
  inconclusive = 2,
  resistant = 4
}: ResultsPanelProps) {
  const accentColor = band === 'CRITICAL' || band === 'HIGH' ? '#f87171' : band === 'MEDIUM' ? '#fbbf24' : '#4ade80'
  const backgroundColor = band === 'CRITICAL' || band === 'HIGH' ? 'rgba(239,68,68,0.08)' : band === 'MEDIUM' ? 'rgba(245,158,11,0.08)' : 'rgba(34,197,94,0.08)'

  return (
    <div className="view" id="view-results">
      <div className="empty" id="results-empty" style={{ display: 'none' }}>
        <div className="empty-icon">📋</div>
        <p>No scan results yet.</p>
        <button className="btn-primary" type="button">
          Run first scan
        </button>
      </div>
      <div id="results-data">
        <div className="risk-panel" id="risk-panel">
          <div className="risk-circle" style={{ background: backgroundColor, border: `2px solid ${accentColor}40` }}>
            <div className="risk-num" style={{ color: accentColor }}>
              {score}
            </div>
            <div className="risk-denom" style={{ color: accentColor }}>
              /100
            </div>
          </div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 600, color: accentColor, marginBottom: '4px' }}>
              {band} risk
            </div>
            <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '10px' }}>
              {description}
            </div>
            <div style={{ display: 'flex', gap: '14px', fontSize: '13px' }}>
              <span style={{ color: '#f87171' }}>✗ {vulnerable} vulnerable</span>
              <span style={{ color: '#fbbf24' }}>? {inconclusive} inconclusive</span>
              <span style={{ color: '#4ade80' }}>✓ {resistant} resistant</span>
            </div>
          </div>
        </div>
        <div className="metrics" id="metrics-row">
          <div className="metric">
            <div className="metric-label">Risk score</div>
            <div className="metric-val" style={{ color: accentColor }}>
              {score}/100
            </div>
          </div>
          <div className="metric">
            <div className="metric-label">Vulnerable</div>
            <div className="metric-val" style={{ color: '#f87171' }}>
              {vulnerable}
            </div>
          </div>
          <div className="metric">
            <div className="metric-label">Inconclusive</div>
            <div className="metric-val" style={{ color: '#fbbf24' }}>
              {inconclusive}
            </div>
          </div>
          <div className="metric">
            <div className="metric-label">Resistant</div>
            <div className="metric-val" style={{ color: '#4ade80' }}>
              {resistant}
            </div>
          </div>
        </div>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div className="card-title" style={{ marginBottom: 0 }}>
              Findings
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn-ghost btn-sm" type="button">
                ⬇ JSON
              </button>
              <button className="btn-ghost btn-sm" type="button">
                ⬇ Markdown
              </button>
            </div>
          </div>
          <table className="ap-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Probe</th>
                <th>Severity</th>
                <th>Verdict</th>
                <th>ATLAS</th>
                <th>Evidence</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="mono">AP-001</td>
                <td>
                  <div className="probe-name">Direct prompt injection</div>
                </td>
                <td>
                  <span className="badge badge-critical">CRITICAL</span>
                </td>
                <td>
                  <span className="badge badge-vuln">✗ Vulnerable</span>
                </td>
                <td className="mono">AML.T0051</td>
                <td style={{ fontSize: '12px', color: 'var(--muted)' }}>
                  The agent followed a malicious instruction sequence without safeguards.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
