import axios, { type AxiosRequestConfig } from 'axios'

const fallbackBaseUrl = 'http://127.0.0.1:8080/api/v1'
const baseURL = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ?? fallbackBaseUrl

export const apiClient = axios.create({
  baseURL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json'
  }
})

export class ApiError extends Error {
  status?: number
  details?: unknown

  constructor(message: string, options?: { status?: number; details?: unknown }) {
    super(message)
    this.name = 'ApiError'
    this.status = options?.status
    this.details = options?.details
  }
}

export function normalizeApiError(error: unknown, fallbackMessage = 'The service is currently unavailable.') {
  if (error instanceof ApiError) {
    return error
  }

  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.detail ?? error.message ?? fallbackMessage
    return new ApiError(message, {
      status: error.response?.status,
      details: error.response?.data
    })
  }

  if (error instanceof Error) {
    return new ApiError(error.message || fallbackMessage)
  }

  return new ApiError(fallbackMessage)
}

export async function request<T>(config: AxiosRequestConfig, signal?: AbortSignal): Promise<T> {
  try {
    const response = await apiClient.request<T>({ ...config, signal })
    return response.data
  } catch (error) {
    throw normalizeApiError(error)
  }
}

export async function get<T>(url: string, signal?: AbortSignal): Promise<T> {
  return request<T>({ method: 'GET', url }, signal)
}

export async function post<T, D = unknown>(url: string, data: D, signal?: AbortSignal): Promise<T> {
  return request<T>({ method: 'POST', url, data }, signal)
}
