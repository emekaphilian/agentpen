import { get, post } from './client'
import type { AssuranceReport, AssuranceResult, Evaluation, Recommendation } from '../../types'
import { getMockAssuranceResult } from './assurance'

function createMockReport(evaluation: Evaluation, assurance: AssuranceResult, options: Partial<AssuranceReport> = {}): AssuranceReport {
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

  const generatedAt = new Date().toISOString()

  return {
    id: `report-${evaluation.id}`,
    evaluationId: evaluation.id,
    metadata: {
      evaluationId: evaluation.id,
      aiSystem: evaluation.aiSystemName,
      modelVersion: evaluation.modelVersion,
      deploymentContext: evaluation.deploymentContext,
      generatedAt
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
    ],
    category: 'Executive',
    status: 'Published',
    owner: 'Governance Office',
    reportType: 'Executive assurance summary',
    evidencePackages: [
      { id: 'pkg-001', name: 'Compliance Copilot Evidence Bundle', confidence: 86, artifactCount: 12, reviewedBy: 'A. Patel' },
      { id: 'pkg-002', name: 'Prompt Injection Replay Pack', confidence: 74, artifactCount: 7, reviewedBy: 'S. Rivera' }
    ],
    signature: {
      signer: 'Dr. K. Nguyen',
      role: 'Chief AI Assurance Officer',
      signedAt: generatedAt,
      status: 'Signed',
      certificateId: 'SIG-2026-08-01-001'
    },
    versionHistory: [
      { version: 'v1.0', publishedAt: generatedAt, status: 'Published', summary: 'Initial executive report published after evidence sign-off.' },
      { version: 'v0.9', publishedAt: new Date(Date.now() - 86400000).toISOString(), status: 'Ready for Review', summary: 'Stakeholder review draft released.' }
    ],
    templates: [
      { id: 'template-exec', name: 'Executive Summary', category: 'Executive', description: 'Leadership-ready assurance narrative.', default: true },
      { id: 'template-compliance', name: 'Compliance Deck', category: 'Compliance', description: 'Framework mapping and evidence sign-off.', default: false }
    ],
    ...options
  }
}

function buildMockEvaluation(id: string, name: string, aiSystemName: string, modelVersion: string): Evaluation {
  return {
    id,
    name,
    description: 'System evaluation for current deployment posture.',
    aiSystemName,
    aiSystemId: 'system-001',
    modelVersion,
    model: modelVersion,
    deploymentContext: 'Internal enterprise copilot',
    pillars: ['Security', 'Safety', 'Reliability', 'Fairness', 'Domain'],
    status: 'Completed' as any,
    stage: 'Completed',
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
    progress: {
      percentage: 100,
      currentStage: 'Completed',
      completedStages: ['Initializing', 'Preparing Environment', 'Executing Tests', 'Collecting Evidence', 'Calculating Scores', 'Building Report', 'Completed'],
      activeTests: [],
      logs: ['Report prepared.']
    },
    configuration: {
      aiSystemId: 'system-001',
      aiSystemName,
      model: modelVersion,
      modelVersion,
      profile: 'Standard',
      pillars: ['Security', 'Safety', 'Reliability', 'Fairness', 'Domain'],
      testSuites: ['OWASP Top 10 for LLM Applications', 'Prompt Injection'],
      runtimeOptions: {
        timeoutMinutes: 20,
        maxConcurrency: 3,
        includeReasoningTrace: true,
        captureEvidence: true,
        notifyOnCompletion: true
      }
    },
    testSuites: ['OWASP Top 10 for LLM Applications', 'Prompt Injection'],
    durationMinutes: 18,
    startedAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
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
    const evaluations = [
      buildMockEvaluation('eval-001', 'Quarterly assurance review', 'AgentPen Copilot', 'GPT-4.1'),
      buildMockEvaluation('eval-002', 'Compliance readiness review', 'AgentPen Copilot', 'GPT-4.1-mini'),
      buildMockEvaluation('eval-003', 'Operational release sign-off', 'AgentPen Copilot', 'GPT-4.1')
    ]

    return [
      createMockReport(evaluations[0], assurance, {
        id: 'report-001',
        category: 'Executive',
        status: 'Published',
        owner: 'Governance Office',
        reportType: 'Executive assurance summary',
        evidencePackages: [
          { id: 'pkg-001', name: 'Compliance Copilot Evidence Bundle', confidence: 86, artifactCount: 12, reviewedBy: 'A. Patel' },
          { id: 'pkg-002', name: 'Prompt Injection Replay Pack', confidence: 74, artifactCount: 7, reviewedBy: 'S. Rivera' }
        ]
      }),
      createMockReport(evaluations[1], assurance, {
        id: 'report-002',
        category: 'Compliance',
        status: 'Ready for Review',
        owner: 'Risk & Compliance',
        reportType: 'Framework alignment and controls',
        evidencePackages: [
          { id: 'pkg-003', name: 'NIST AI RMF Evidence Pack', confidence: 79, artifactCount: 9, reviewedBy: 'M. Chen' }
        ],
        signature: {
          signer: 'M. Chen',
          role: 'Compliance Lead',
          signedAt: new Date().toISOString(),
          status: 'Pending',
          certificateId: 'SIG-2026-08-01-002'
        }
      }),
      createMockReport(evaluations[2], assurance, {
        id: 'report-003',
        category: 'Operational',
        status: 'Scheduled',
        owner: 'Operations',
        reportType: 'Release readiness monitor',
        evidencePackages: [
          { id: 'pkg-004', name: 'Operational Monitoring Bundle', confidence: 81, artifactCount: 6, reviewedBy: 'L. Brooks' }
        ],
        versionHistory: [
          { version: 'v0.8', publishedAt: new Date(Date.now() - 172800000).toISOString(), status: 'Scheduled', summary: 'Operational release plan drafted.' }
        ]
      })
    ]
  }
}

export async function getReportById(id: string, signal?: AbortSignal): Promise<AssuranceReport> {
  try {
    const response = await get<AssuranceReport>(`/reports/${encodeURIComponent(id)}`, signal)
    return response
  } catch {
    const reports = await getReports(signal)
    return reports.find((report) => report.id === id) ?? reports[0]
  }
}

export async function createReport(signal?: AbortSignal): Promise<AssuranceReport> {
  try {
    const response = await post<AssuranceReport>('/reports', {}, signal)
    return response
  } catch {
    const assurance = await getMockAssuranceResult()
    const evaluation = buildMockEvaluation('eval-004', 'New draft report', 'AgentPen Copilot', 'GPT-4.1')
    return createMockReport(evaluation, assurance, {
      id: 'report-draft',
      category: 'Template',
      status: 'Draft',
      owner: 'Analyst',
      reportType: 'Draft report template',
      evidencePackages: [],
      signature: {
        signer: 'Pending',
        role: 'Analyst',
        signedAt: new Date().toISOString(),
        status: 'Pending',
        certificateId: 'SIG-PENDING'
      }
    })
  }
}
