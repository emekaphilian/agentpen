import { get, post } from './client'
import type { AssuranceReport } from '../../types'

export async function getReports(signal?: AbortSignal): Promise<AssuranceReport[]> {
  return get<AssuranceReport[]>('/reports', signal)
}

export async function getReportById(id: string, signal?: AbortSignal): Promise<AssuranceReport> {
  return get<AssuranceReport>(`/reports/${encodeURIComponent(id)}`, signal)
}

export async function createReport(signal?: AbortSignal): Promise<AssuranceReport> {
  return post<AssuranceReport>('/reports', {}, signal)
}
