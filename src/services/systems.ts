import axios from 'axios'

const apiBase = (import.meta.env.VITE_API_BASE_URL as string) ?? 'http://127.0.0.1:8080/api/v1'

export interface Finding {
  id: string
  title: string
  description: string
  severity: string
}

export interface SystemSummary {
  id: string
  name: string
  target_url: string
  status: string
  risk_score: number
  finding_count: number
}

export interface SystemDetails extends SystemSummary {
  findings: Finding[]
}

export async function fetchSystems() {
  const response = await axios.get<SystemSummary[]>(`${apiBase}/systems`)
  return response.data
}

export async function fetchSystemDetails(systemId: string) {
  const response = await axios.get<SystemDetails>(`${apiBase}/systems/${encodeURIComponent(systemId)}`)
  return response.data
}
