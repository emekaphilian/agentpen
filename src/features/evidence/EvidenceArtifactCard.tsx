import type { EvidenceArtifact } from '../../types'
import { ConfidenceIndicator } from './ConfidenceIndicator'

interface EvidenceArtifactCardProps {
  artifact: EvidenceArtifact
}

export function EvidenceArtifactCard({ artifact }: EvidenceArtifactCardProps) {
  return (
    <div className="card" style={{ marginBottom: '0.75rem' }}>
      <div className="system-name">{artifact.title}</div>
      <div className="system-meta">{artifact.description}</div>
      <div className="system-meta">Pillar: {artifact.assurancePillar}</div>
      <div className="system-meta">Severity: {artifact.severity}</div>
      <div className="system-meta" style={{ marginTop: '0.5rem' }}>
        <ConfidenceIndicator confidence={artifact.confidence} />
      </div>
    </div>
  )
}
