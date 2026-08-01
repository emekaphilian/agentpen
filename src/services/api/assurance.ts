import { get } from './client'
import type { AssuranceCategory, AssurancePillar, AssuranceResult, Evidence, Recommendation, RiskLevel } from '../../types'
import { getMockEvidence } from './evidence'

const pillarWeights: Record<AssurancePillar, number> = {
  Security: 0.24,
  Safety: 0.2,
  Reliability: 0.2,
  Fairness: 0.18,
  Domain: 0.18
}

const severityScores: Record<Evidence['severity'], number> = {
  low: 0.65,
  medium: 0.8,
  high: 0.9,
  critical: 1
}

const confidenceScores: Record<Evidence['confidence'], number> = {
  low: 0.6,
  medium: 0.75,
  high: 0.9
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function classifyRisk(score: number): RiskLevel {
  if (score >= 90) return 'informational'
  if (score >= 75) return 'low'
  if (score >= 60) return 'medium'
  if (score >= 45) return 'high'
  return 'critical'
}

function getTrend(pillar: AssurancePillar): AssuranceCategory['trend'] {
  if (pillar === 'Safety') return 'up'
  if (pillar === 'Fairness') return 'down'
  return 'stable'
}

function buildRecommendations(pillars: AssuranceCategory[]): Recommendation[] {
  const focus = pillars
    .filter((pillar) => pillar.riskLevel === 'high' || pillar.riskLevel === 'medium')
    .slice(0, 2)

  return focus.map((pillar, index) => ({
    id: `rec-${index + 1}`,
    title: `${pillar.name} controls`,
    description: `Strengthen ${pillar.name.toLowerCase()} monitoring and evidence review processes to improve resilience.`,
    priority: pillar.riskLevel === 'high' ? 'high' : 'medium'
  }))
}

function calculateAssuranceResult(evaluationId: string, evidence: Evidence[]): AssuranceResult {
  const byPillar = Object.keys(pillarWeights) as AssurancePillar[]
  const categories: AssuranceCategory[] = byPillar.map((pillar) => {
    const pillarEvidence = evidence.filter((item) => item.assurancePillar === pillar)
    const evidenceScore = pillarEvidence.reduce((sum, item) => {
      return sum + severityScores[item.severity] * confidenceScores[item.confidence]
    }, 0)

    const countFactor = Math.min(1, pillarEvidence.length / 3)
    const rawScore = clamp(60 + evidenceScore * 12 + countFactor * 10, 0, 100)
    const weightedScore = Math.round(rawScore * 0.88)
    const confidence = clamp(0.6 + (pillarEvidence.length ? 0.05 * Math.min(3, pillarEvidence.length) : 0) + (pillarEvidence.some((item) => item.confidence === 'high') ? 0.1 : 0), 0.55, 0.95)
    const riskLevel = classifyRisk(rawScore)

    return {
      name: pillar,
      rawScore: Math.round(rawScore),
      weightedScore,
      confidence,
      riskLevel,
      trend: getTrend(pillar)
    }
  })

  const overallScore = Math.round(categories.reduce((sum, item) => sum + item.weightedScore * pillarWeights[item.name], 0))
  const riskLevel = classifyRisk(overallScore)

  return {
    id: `assurance-${evaluationId}`,
    evaluationId,
    overallScore,
    riskLevel,
    summary: 'The score engine combines evidence quality, control coverage, and residual risk to produce a transparent assurance view.',
    categories,
    recommendations: buildRecommendations(categories)
  }
}

export async function getAssuranceByEvaluationId(evaluationId: string, signal?: AbortSignal): Promise<AssuranceResult> {
  try {
    const response = await get<AssuranceResult>(`/evaluations/${encodeURIComponent(evaluationId)}/assurance`, signal)
    return response
  } catch {
    const evidence = await getMockEvidence()
    return calculateAssuranceResult(evaluationId, evidence)
  }
}

export async function getAssuranceById(id: string, signal?: AbortSignal): Promise<AssuranceResult> {
  try {
    const response = await get<AssuranceResult>(`/assurance/${encodeURIComponent(id)}`, signal)
    return response
  } catch {
    const evidence = await getMockEvidence()
    return calculateAssuranceResult(id, evidence)
  }
}

export async function getMockAssuranceResult(): Promise<AssuranceResult> {
  const evidence = await getMockEvidence()
  return calculateAssuranceResult('eval-001', evidence)
}
