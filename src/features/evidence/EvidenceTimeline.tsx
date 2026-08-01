import type { Evidence } from '../../types'

interface EvidenceTimelineProps {
  evidence: Evidence[]
}

export function EvidenceTimeline({ evidence }: EvidenceTimelineProps) {
  return (
    <div className="finding-list">
      {evidence.map((item) => (
        <div key={item.id} className="card" style={{ marginBottom: '0.75rem' }}>
          <div className="system-name">{item.title}</div>
          <div className="system-meta">{new Date(item.timestamp).toLocaleString()}</div>
          <div className="system-meta">{item.category}</div>
        </div>
      ))}
    </div>
  )
}
