import { get } from './client'
import type { AssuranceCategory, AssurancePillar, AssuranceResult, DeploymentDecision, Evidence, Recommendation, RiskLevel, RiskMatrix, StandardsMapping, TrendAnalysis } from '../../types'
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
    .slice(0, 3)

  return focus.map((pillar, index) => ({
    id: `rec-${index + 1}`,
    title: `${pillar.name} controls`,
    description: `Strengthen ${pillar.name.toLowerCase()} monitoring and evidence review processes to improve resilience.`,
    priority: pillar.riskLevel === 'high' ? 'high' : 'medium',
    relatedPillar: pillar.name,
    suggestedAction: pillar.riskLevel === 'high' ? 'Immediate remediation' : 'Increase coverage'
  }))
}

function buildStandardsMappings(): StandardsMapping[] {
  return [
    { framework: 'MITRE ATLAS', mapping: 'Prompt injection and unsafe tool execution' },
    { framework: 'OWASP Top 10 for LLM Applications', mapping: 'Prompt injection, model hijacking, data leakage' },
    { framework: 'NIST AI RMF', mapping: 'Governance, measurement, and risk management' },
    { framework: 'ISO/IEC 42001', mapping: 'AI management system controls and evidence traceability' },
    { framework: 'EU AI Act', mapping: 'High-risk governance and transparency controls' }
  ]
}

function buildRiskMatrix(): RiskMatrix {
  return {
    likelihood: 'Medium',
    impact: 'High',
    overallPosition: 'Monitor'
  }
}

function buildTrendAnalysis(categories: AssuranceCategory[]): TrendAnalysis[] {
  return categories.map((category) => ({
    pillar: category.name,
    previousScore: Math.max(50, category.weightedScore - (category.name === 'Reliability' ? 12 : category.name === 'Safety' ? 4 : 6)),
    currentScore: category.weightedScore,
    change: category.weightedScore - Math.max(50, category.weightedScore - (category.name === 'Reliability' ? 12 : category.name === 'Safety' ? 4 : 6)),
    direction: category.weightedScore >= 80 ? 'up' : category.weightedScore >= 70 ? 'stable' : 'down',
    summary: category.name === 'Reliability' ? 'Evaluation consistency improved across test cases.' : category.name === 'Safety' ? 'Residual harmful-output handling regressed slightly.' : 'Control coverage is trending in a positive direction.'
  }))
}

function buildDeploymentDecision(score: number): DeploymentDecision {
  if (score >= 90) {
    return { label: 'Approved', reason: 'The evidence profile is strong and residual risk is low.' }
  }
  if (score >= 80) {
    return { label: 'Approved with Monitoring', reason: 'The deployment meets the target threshold with continued monitoring.' }
  }
  if (score >= 65) {
    return { label: 'Needs Remediation', reason: 'The current evidence indicates remediation is needed before broad deployment.' }
  }
  if (score >= 50) {
    return { label: 'High Risk', reason: 'The assurance posture is not yet sufficient for deployment without further controls.' }
  }
  return { label: 'Do Not Deploy', reason: 'The evidence profile is inadequate for deployment.' }
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
    confidence: Math.round(categories.reduce((sum, item) => sum + item.confidence, 0) / categories.length * 100),
    deploymentDecision: buildDeploymentDecision(overallScore),
    categories,
    recommendations: buildRecommendations(categories),
    standardsMappings: buildStandardsMappings(),
    riskMatrix: buildRiskMatrix(),
    trendAnalysis: buildTrendAnalysis(categories)
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
