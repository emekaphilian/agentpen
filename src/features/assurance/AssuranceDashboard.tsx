import { useEffect, useState } from 'react'
import { getAssuranceByEvaluationId, getAssuranceById } from '../../services/api/assurance'
import type { AssuranceResult } from '../../types'
import { AssuranceBreakdown } from './AssuranceBreakdown'
import { AssuranceRadar } from './AssuranceRadar'
import { AssuranceScoreCard } from './AssuranceScoreCard'
import { AssuranceSummary } from './AssuranceSummary'
import { RecommendationSummary } from './RecommendationSummary'

interface AssuranceDashboardProps {
  evaluationId?: string
}

export function AssuranceDashboard({ evaluationId }: AssuranceDashboardProps) {
  const [result, setResult] = useState<AssuranceResult | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const data = evaluationId
          ? await getAssuranceByEvaluationId(evaluationId)
          : await getAssuranceById('assurance-001')
        setResult(data)
      } catch {
        setResult(null)
      }
    }

    void load()
  }, [evaluationId])

  if (!result) {
    return (
      <div className="card" style={{ padding: '1rem' }}>
        <p className="system-meta">No assurance score is available yet.</p>
      </div>
    )
  }

  return (
    <div className="details-grid">
      <div className="full-width">
        <AssuranceSummary result={result} />
      </div>

      <div className="full-width">
        <AssuranceScoreCard result={result} />
      </div>

      <div className="full-width">
        <AssuranceBreakdown result={result} />
      </div>

      <div className="full-width">
        <AssuranceRadar result={result} />
      </div>

      <div className="full-width">
        <RecommendationSummary result={result} />
      </div>
    </div>
  )
}
