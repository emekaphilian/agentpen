interface OverviewCardsProps {
  score?: string | number
  band?: string
  description?: string
  vulnerable?: string | number
  inconclusive?: string | number
  resistant?: string | number
  accentColor?: string
  backgroundColor?: string
  confidence?: string | number
  riskRating?: string
  recommendation?: string
}

export default function OverviewCards({
  score = '0',
  band = 'MINIMAL',
  description = 'No assurance evidence yet.',
  vulnerable = '0',
  inconclusive = '0',
  resistant = '0',
  accentColor = '#e2e8f0',
  backgroundColor = 'rgba(34,197,94,0.08)',
  confidence = '0%',
  riskRating = 'Pending',
  recommendation = 'Further Evaluation Required'
}: OverviewCardsProps) {
  return (
    <div>
      <div
        className="risk-panel"
        style={{
          background: 'var(--bg2)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '1.25rem',
          marginBottom: '1.25rem'
        }}
      >
        <div
          className="risk-circle"
          style={{
            background: backgroundColor,
            border: `2px solid ${accentColor}40`
          }}
        >
          <div className="risk-num" style={{ color: accentColor }}>
            {score}
          </div>
          <div className="risk-denom" style={{ color: accentColor }}>
            /100
          </div>
        </div>
        <div>
          <div style={{ fontSize: '16px', fontWeight: 600, color: accentColor, marginBottom: '4px' }}>
            {band} assurance
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

      <div className="metrics">
        <div className="metric">
          <div className="metric-label">Overall Assurance Score</div>
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
    </div>
  )
}
