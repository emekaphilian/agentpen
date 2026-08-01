import { get, post } from './client'
import type { AssuranceReport, AssuranceResult, Evaluation, Recommendation, RiskLevel } from '../../types'
import { getMockEvidence } from './evidence'
import { getMockAssuranceResult } from './assurance'

function createMockReport(evaluation: Evaluation, assurance: AssuranceResult): AssuranceReport {
  const findings = [
    {
      id: 'finding-001',
      title: 'Prompt leakage exposure',
      summary: 'Evidence indicates prompt fragments can be surfaced during adversarial prompting.',
      severity: 'high' as const,
      pillar: 'Security' as const
    },
    {
      id: 'finding-002',
      title: 'Reliability variance under retrieval stress',
      summary: 'The system remains stable but shows moderate variance under retrieval pressure.',
      severity: 'medium' as const,
      pillar: 'Reliability' as const
    }
  ]

  const recommendations: Recommendation[] = assurance.recommendations.map((item, index) => ({
    ...item,
    id: `report-rec-${index + 1}`
  }))

  return {
    id: `report-${evaluation.id}`,
    evaluationId: evaluation.id,
    metadata: {
      evaluationId: evaluation.id,
      aiSystem: evaluation.aiSystemName,
      modelVersion: evaluation.modelVersion,
      deploymentContext: evaluation.deploymentContext,
      generatedAt: new Date().toISOString()
    },
    executiveSummary: {
      headline: 'Assurance posture is broadly stable with targeted risk reduction required.',
      overview: 'The current evidence package indicates acceptable control coverage with a few priority findings that should be remediated to reduce residual risk.',
      highlights: [
        'Evidence coverage spans the core assurance pillars.',
        'Security and reliability require intervention prioritization.',
        'Framework mappings are included as placeholders until the backend publishes them.'
      ]
    },
    pillars: {
      Security: assurance.categories.find((category) => category.name === 'Security') ?? assurance.categories[0],
      Safety: assurance.categories.find((category) => category.name === 'Safety') ?? assurance.categories[1],
      Reliability: assurance.categories.find((category) => category.name === 'Reliability') ?? assurance.categories[2],
      Fairness: assurance.categories.find((category) => category.name === 'Fairness') ?? assurance.categories[3],
      Domain: assurance.categories.find((category) => category.name === 'Domain') ?? assurance.categories[4]
    },
    overallScore: assurance.overallScore,
    riskLevel: assurance.riskLevel,
    evidenceSummary: {
      totalArtifacts: 4,
      highSeverityCount: findings.filter((finding) => finding.severity === 'high').length,
      averageConfidence: 0.82,
      coverage: 88
    },
    findings,
    recommendations,
    frameworkMappings: [
      {
        framework: 'MITRE ATLAS',
        mapping: 'Maps prompt injection and adversarial misuse findings to defensive controls and detection coverage.'
      },
      {
        framework: 'OWASP Top 10 for LLM Applications',
        mapping: 'Aligns evidence with prompt injection, insecure output handling, and model abuse mitigations.'
      },
      {
        framework: 'NIST AI RMF',
        mapping: 'Connects assurance posture to govern, map, measure, and manage controls.'
      },
      {
        framework: 'ISO/IEC 42001',
        mapping: 'Provides organizational management system alignment for responsible AI operations.'
      }
    ]
  }
}

function buildMockEvaluation(): Evaluation {
  return {
    id: 'eval-001',
    name: 'Quarterly assurance review',
    description: 'System evaluation for current deployment posture.',
    aiSystemName: 'AgentPen Copilot',
    aiSystemId: 'system-001',
    modelVersion: 'GPT-4.1',
    deploymentContext: 'Internal enterprise copilot',
    pillars: ['Security', 'Safety', 'Reliability', 'Fairness', 'Domain'],
    status: 'Completed' as any,
    summary: 'Assurance evidence has been aggregated for this report.',
    assuranceScore: {
      overall: 82,
      security: 78,
      safety: 84,
      reliability: 88,
      fairness: 80,
      domain: 76
    },
    evidence: [],
    recommendations: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
}

export async function getReports(signal?: AbortSignal): Promise<AssuranceReport[]> {
  try {
    const response = await get<AssuranceReport[]>('/reports', signal)
    return response
  } catch {
    const assurance = await getMockAssuranceResult()
    const evaluation = buildMockEvaluation()
    return [createMockReport(evaluation, assurance)]
  }
}

export async function getReportById(id: string, signal?: AbortSignal): Promise<AssuranceReport> {
  try {
    const response = await get<AssuranceReport>(`/reports/${encodeURIComponent(id)}`, signal)
    return response
  } catch {
    const assurance = await getMockAssuranceResult()
    const evaluation = buildMockEvaluation()
    return createMockReport(evaluation, assurance)
  }
}

export async function createReport(signal?: AbortSignal): Promise<AssuranceReport> {
  try {
    const response = await post<AssuranceReport>('/reports', {}, signal)
    return response
  } catch {
    const assurance = await getMockAssuranceResult()
    const evaluation = buildMockEvaluation()
    return createMockReport(evaluation, assurance)
  }
}
