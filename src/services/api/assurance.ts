import { get } from './client'
import type { AssuranceResult } from '../../types'

export async function getAssuranceByEvaluationId(evaluationId: string, signal?: AbortSignal): Promise<AssuranceResult> {
  return get<AssuranceResult>(`/evaluations/${encodeURIComponent(evaluationId)}/assurance`, signal)
}

export async function getAssuranceById(id: string, signal?: AbortSignal): Promise<AssuranceResult> {
  return get<AssuranceResult>(`/assurance/${encodeURIComponent(id)}`, signal)
}

export async function getMockAssuranceResult(): Promise<AssuranceResult> {
  return get<AssuranceResult>('/assurance/eval-001')
}
