import type { Evidence } from '../../types'
import { EvidenceArtifactCard } from './EvidenceArtifactCard'
import { EvidenceSummary } from './EvidenceSummary'
import { EvidenceTimeline } from './EvidenceTimeline'
import { RecommendationPanel } from './RecommendationPanel'

interface EvidenceViewerProps {
  evidence: Evidence[]
}

export function EvidenceViewer({ evidence }: EvidenceViewerProps) {
  return (
    <div className="details-grid">
      <div className="full-width">
        <EvidenceSummary evidence={evidence} />
      </div>

      <div className="full-width">
        <p className="detail-label">Timeline</p>
        <EvidenceTimeline evidence={evidence} />
      </div>

      <div className="full-width">
        <p className="detail-label">Artifacts</p>
        {evidence.map((item) => (
          <EvidenceArtifactCard key={item.id} artifact={item} />
        ))}
      </div>

      <div className="full-width">
        <RecommendationPanel evidence={evidence} />
      </div>
    </div>
  )
}
