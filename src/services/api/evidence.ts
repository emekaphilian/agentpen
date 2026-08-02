import { get, post } from './client'
import type { Evidence, EvidenceArtifact, EvidenceExport, EvidencePackage } from '../../types'

export async function getEvidencePackages(): Promise<EvidencePackage[]> {
  return get<EvidencePackage[]>('/evidence/packages')
}

export async function getEvidence(id: string): Promise<EvidencePackage> {
  return get<EvidencePackage>(`/evidence/packages/${encodeURIComponent(id)}`)
}

export async function getEvidenceTimeline(id: string): Promise<unknown[]> {
  return get<unknown[]>(`/evidence/packages/${encodeURIComponent(id)}/timeline`)
}

export async function downloadEvidence(id: string) {
  return post(`/evidence/packages/${encodeURIComponent(id)}/download`, {})
}

export async function exportEvidence(id: string, format: EvidenceExport['format']) {
  return post(`/evidence/packages/${encodeURIComponent(id)}/export`, { format })
}

export async function verifyEvidence(id: string) {
  return post(`/evidence/packages/${encodeURIComponent(id)}/verify`, {})
}

export async function getEvidenceByEvaluationId(evaluationId: string, signal?: AbortSignal): Promise<Evidence[]> {
  return get<Evidence[]>(`/evaluations/${encodeURIComponent(evaluationId)}/evidence`, signal)
}

export async function getEvidenceById(id: string, signal?: AbortSignal): Promise<Evidence | null> {
  try {
    const response = await get<Evidence>(`/evidence/packages/${encodeURIComponent(id)}`, signal)
    return response
  } catch {
    return null
  }
}

export async function getMockEvidence(evaluationId?: string): Promise<Evidence[]> {
  const targetId = evaluationId ?? 'eval-001'
  return getEvidenceByEvaluationId(targetId)
}

export async function getMockEvidenceArtifact(): Promise<EvidenceArtifact> {
  const items = await getMockEvidence('eval-001')
  return items[0] as EvidenceArtifact
}
