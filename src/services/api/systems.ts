import axios from 'axios'
import { SystemSummary, SystemDetails } from '../../types'

const apiBase = (import.meta.env.VITE_API_BASE_URL as string) ?? 'http://127.0.0.1:8080/api/v1'

export async function fetchSystems() {
  const response = await axios.get<SystemSummary[]>(`${apiBase}/systems`)
  return response.data
}

export async function fetchSystemDetails(systemId: string) {
  const response = await axios.get<SystemDetails>(`${apiBase}/systems/${encodeURIComponent(systemId)}`)
  return response.data
}
