import { get, post } from './client'
import type { Evaluation, EvaluationCreateInput } from '../../types'

export interface EvaluationServiceState {
  data: Evaluation[]
  loading: boolean
  error: string | null
}

export interface EvaluationDetailState {
  data: Evaluation | null
  loading: boolean
  error: string | null
}

const emptyListState: EvaluationServiceState = {
  data: [],
  loading: false,
  error: null
}

const emptyDetailState: EvaluationDetailState = {
  data: null,
  loading: false,
  error: null
}

export async function getEvaluations(signal?: AbortSignal): Promise<Evaluation[]> {
  return get<Evaluation[]>('/evaluations', signal)
}

export async function fetchEvaluations(signal?: AbortSignal): Promise<EvaluationServiceState> {
  try {
    const data = await getEvaluations(signal)
    return { data, loading: false, error: null }
  } catch (error) {
    return {
      data: [],
      loading: false,
      error: error instanceof Error ? error.message : 'Unable to load evaluations.'
    }
  }
}

export async function createEvaluation(input: EvaluationCreateInput, signal?: AbortSignal): Promise<Evaluation> {
  return post<Evaluation, EvaluationCreateInput>('/evaluations', input, signal)
}

export async function getEvaluationById(id: string, signal?: AbortSignal): Promise<Evaluation | null> {
  try {
    return await get<Evaluation>(`/evaluations/${encodeURIComponent(id)}`, signal)
  } catch (error) {
    if (error instanceof Error && /not found/i.test(error.message)) {
      return null
    }
    throw error
  }
}

export async function fetchEvaluationDetail(id: string, signal?: AbortSignal): Promise<EvaluationDetailState> {
  try {
    const data = await getEvaluationById(id, signal)
    return { data, loading: false, error: null }
  } catch (error) {
    return {
      data: null,
      loading: false,
      error: error instanceof Error ? error.message : 'Unable to load evaluation details.'
    }
  }
}

export function getEmptyEvaluationState(): EvaluationServiceState {
  return { ...emptyListState }
}

export function getEmptyEvaluationDetailState(): EvaluationDetailState {
  return { ...emptyDetailState }
}
