import type { Evidence } from '../../types'

interface EvidenceSummaryProps {
  evidence: Evidence[]
}

export function EvidenceSummary({ evidence }: EvidenceSummaryProps) {
  const promptCount = evidence.length
  const responseCount = evidence.filter((item) => item.category === 'TestResult').length
  const findingCount = evidence.filter((item) => item.category === 'Finding').length
  const recommendationCount = evidence.reduce((sum, item) => sum + item.recommendations.length, 0)
  const averageConfidence = evidence.length
    ? Math.round((evidence.reduce((sum, item) => sum + (item.confidence === 'high' ? 3 : item.confidence === 'medium' ? 2 : 1), 0) / evidence.length) * 100) / 100
    : 0

  return (
    <div className="status-message">
      <p className="detail-label">Evidence summary</p>
      <h2 className="system-name">{evidence.length} artifact{evidence.length === 1 ? '' : 's'}</h2>
      <div className="metrics" style={{ marginTop: '0.75rem' }}>
        <div className="metric">
          <div className="metric-label">Prompts tested</div>
          <div className="metric-val">{promptCount}</div>
        </div>
        <div className="metric">
          <div className="metric-label">Responses collected</div>
          <div className="metric-val">{responseCount}</div>
        </div>
        <div className="metric">
          <div className="metric-label">Evidence artifacts</div>
          <div className="metric-val">{evidence.length}</div>
        </div>
        <div className="metric">
          <div className="metric-label">Findings</div>
          <div className="metric-val">{findingCount}</div>
        </div>
      </div>
      <div className="metrics" style={{ marginTop: '0.5rem' }}>
        <div className="metric">
          <div className="metric-label">Recommendations</div>
          <div className="metric-val">{recommendationCount}</div>
        </div>
        <div className="metric">
          <div className="metric-label">Confidence level</div>
          <div className="metric-val">{averageConfidence.toFixed(2)}</div>
        </div>
      </div>
    </div>
  )
}
