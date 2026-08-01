import type { EvidenceConfidence } from '../../types'

interface ConfidenceIndicatorProps {
  confidence: EvidenceConfidence
}

const confidenceStyles: Record<EvidenceConfidence, string> = {
  low: 'rgba(248, 113, 113, 0.16)',
  medium: 'rgba(250, 204, 21, 0.16)',
  high: 'rgba(52, 211, 153, 0.16)'
}

const confidenceTextStyles: Record<EvidenceConfidence, string> = {
  low: '#fecaca',
  medium: '#fde68a',
  high: '#bbf7d0'
}

export function ConfidenceIndicator({ confidence }: ConfidenceIndicatorProps) {
  return (
    <span
      className="badge"
      style={{
        background: confidenceStyles[confidence],
        color: confidenceTextStyles[confidence],
        borderColor: confidenceTextStyles[confidence]
      }}
    >
      Confidence: {confidence}
    </span>
  )
}
