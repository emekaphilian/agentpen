import { get } from './client'
import type { Evidence, EvidenceArtifact, EvidenceExport, EvidencePackage } from '../../types'

const mockEvidence: Evidence[] = [
  {
    id: 'ev-001',
    evaluationId: 'eval-001',
    title: 'Prompt leakage observed',
    description: 'The model exposed system prompt fragments during a policy review challenge.',
    assurancePillar: 'Security',
    severity: 'high',
    confidence: 'high',
    timestamp: '2026-08-01T10:00:00.000Z',
    metadata: {
      source: 'red-team',
      target: 'policy-review',
      reproducible: true
    },
    category: 'Finding',
    recommendations: [
      {
        id: 'rec-001',
        title: 'Add prompt filtering',
        description: 'Introduce stricter prompt and tool-routing controls.',
        priority: 'high'
      }
    ]
  },
  {
    id: 'ev-002',
    evaluationId: 'eval-001',
    title: 'Hallucination rate within tolerance',
    description: 'The evaluation completed with stable outputs and acceptable factuality variance.',
    assurancePillar: 'Reliability',
    severity: 'medium',
    confidence: 'medium',
    timestamp: '2026-08-01T10:15:00.000Z',
    metadata: {
      source: 'benchmark',
      target: 'knowledge-retrieval',
      reproducible: true
    },
    category: 'TestResult',
    recommendations: []
  }
]

const mockPackages: EvidencePackage[] = [
  {
    id: 'pkg-001',
    evaluationId: 'eval-001',
    targetSystem: 'Compliance Copilot',
    model: 'GPT-4.1',
    version: '2026-04',
    testSuite: 'OWASP Top 10 for LLM Applications',
    evaluationDate: '2026-08-01T09:30:00.000Z',
    confidence: 86,
    assuranceStatus: 'Signed',
    overallScore: 84,
    signed: true,
    pendingReview: false,
    artifacts: [
      {
        id: 'art-001',
        evaluationId: 'eval-001',
        title: 'Prompt log',
        description: 'Captured prompt transcript and token metadata.',
        assurancePillar: 'Security',
        severity: 'high',
        confidence: 'high',
        timestamp: '2026-08-01T10:00:00.000Z',
        metadata: {
          type: 'Prompt Logs',
          size: '1.4 MB',
          source: 'red-team'
        }
      },
      {
        id: 'art-002',
        evaluationId: 'eval-001',
        title: 'Response log',
        description: 'Full response transcript and classification labels.',
        assurancePillar: 'Reliability',
        severity: 'medium',
        confidence: 'medium',
        timestamp: '2026-08-01T10:15:00.000Z',
        metadata: {
          type: 'Response Logs',
          size: '840 KB',
          source: 'benchmark'
        }
      }
    ],
    timeline: [
      {
        id: 'tl-001',
        title: 'Discovery',
        description: 'Asset and deployment context captured.',
        timestamp: '2026-08-01T09:15:00.000Z',
        testId: 'discovery-01'
      },
      {
        id: 'tl-002',
        title: 'Evaluation Started',
        description: 'Evaluation workflow seeded with the selected suites.',
        timestamp: '2026-08-01T09:30:00.000Z',
        testId: 'eval-01'
      },
      {
        id: 'tl-003',
        title: 'Tests Executed',
        description: 'Prompt injection and benchmark cases executed.',
        timestamp: '2026-08-01T09:50:00.000Z',
        testId: 'tests-01'
      },
      {
        id: 'tl-004',
        title: 'Evidence Collected',
        description: 'Artifacts and traces attached to the evaluation package.',
        timestamp: '2026-08-01T10:00:00.000Z',
        testId: 'evidence-01'
      },
      {
        id: 'tl-005',
        title: 'Evidence Verified',
        description: 'Governance reviewers approved the evidence bundle.',
        timestamp: '2026-08-01T10:20:00.000Z',
        testId: 'verify-01'
      },
      {
        id: 'tl-006',
        title: 'Assurance Generated',
        description: 'Assurance score and narrative created.',
        timestamp: '2026-08-01T10:35:00.000Z',
        testId: 'assurance-01'
      },
      {
        id: 'tl-007',
        title: 'Report Signed',
        description: 'Evidence package became report-ready.',
        timestamp: '2026-08-01T10:45:00.000Z',
        testId: 'report-01'
      }
    ],
    metadata: {
      evaluator: 'AgentPen Governance',
      timestamp: '2026-08-01T10:45:00.000Z',
      model: 'GPT-4.1',
      version: '2026-04',
      deploymentContext: 'Cloud enterprise copilot',
      runtime: '22m 30s'
    },
    confidenceSummary: {
      confidence: 86,
      dataCompleteness: 91,
      testCoverage: 88,
      evidenceQuality: 84,
      reproducibility: 82
    },
    recommendations: [
      {
        id: 'rec-001',
        priority: 'high',
        category: 'Prompt Hardening',
        recommendation: 'Introduce additional input validation and policy routing controls.',
        expectedImprovement: 'Reduce leakage risk by 18%.'
      }
    ]
  }
]

export async function getEvidencePackages() {
  return Promise.resolve(mockPackages)
}

export async function getEvidence(id: string) {
  const pkg = mockPackages.find((item) => item.id === id) ?? mockPackages[0]
  return Promise.resolve(pkg)
}

export async function getEvidenceTimeline() {
  return Promise.resolve(mockPackages[0].timeline)
}

export async function downloadEvidence(id: string) {
  return Promise.resolve({ id, status: 'downloaded' })
}

export async function exportEvidence(id: string, format: EvidenceExport['format']) {
  return Promise.resolve({ id, format, status: 'exported' })
}

export async function verifyEvidence(id: string) {
  return Promise.resolve(true)
}

export async function getEvidenceByEvaluationId(evaluationId: string, signal?: AbortSignal): Promise<Evidence[]> {
  const response = await get<Evidence[]>(`/evaluations/${encodeURIComponent(evaluationId)}/evidence`, signal)
  return response
}

export async function getEvidenceById(id: string, signal?: AbortSignal): Promise<Evidence | null> {
  try {
    const response = await get<Evidence>(`/evidence/${encodeURIComponent(id)}`, signal)
    return response
  } catch {
    return null
  }
}

export async function getMockEvidence(): Promise<Evidence[]> {
  return Promise.resolve(mockEvidence)
}

export async function getMockEvidenceArtifact(): Promise<EvidenceArtifact> {
  return Promise.resolve(mockEvidence[0])
}
