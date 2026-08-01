import { get } from './client'
import type { Evidence, EvidenceArtifact } from '../../types'

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
