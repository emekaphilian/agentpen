import { get, post } from './client'
import { buildLifecycleState } from './evaluationLifecycle'
import { EvaluationStatus, type Evaluation, type EvaluationConfiguration, type EvaluationCreateInput, type EvaluationProfile, type EvaluationProgress, type EvaluationRuntimeOptions, type EvaluationStage } from '../../types'

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

let mockEvaluations: Evaluation[] = [
  {
    id: 'eval-001',
    name: 'GPT-4.1 Enterprise Assistant Review',
    description: 'Red-team review for the enterprise assistant in a customer support environment.',
    aiSystemName: 'GPT-4.1 Enterprise Assistant',
    aiSystemId: 'sys-gpt41',
    modelVersion: 'gpt-4.1-2026-04',
    model: 'GPT-4.1',
    deploymentContext: 'Cloud',
    pillars: ['Security', 'Safety', 'Reliability'],
    status: EvaluationStatus.Completed,
    stage: 'Completed',
    summary: 'Completed with strong resilience and a 91/100 assurance score.',
    assuranceScore: { overall: 91, security: 88, safety: 94, reliability: 90, fairness: 86, domain: 92 },
    evidence: [],
    recommendations: [],
    progress: {
      percentage: 100,
      currentStage: 'Completed',
      completedStages: ['Initializing', 'Preparing Environment', 'Executing Tests', 'Collecting Evidence', 'Calculating Scores', 'Building Report', 'Completed'],
      activeTests: ['Prompt Injection', 'Hallucination', 'Tool Abuse'],
      logs: ['Completed evaluation successfully.', 'Evidence bundle generated.']
    },
    configuration: buildConfiguration({
      aiSystemId: 'sys-gpt41',
      aiSystemName: 'GPT-4.1 Enterprise Assistant',
      modelVersion: 'gpt-4.1-2026-04',
      model: 'GPT-4.1',
      deploymentContext: 'Cloud',
      pillars: ['Security', 'Safety', 'Reliability'],
      profile: 'Production',
      testSuites: ['OWASP Top 10 for LLM Applications', 'Prompt Injection', 'Hallucination'],
      runtimeOptions: { timeoutMinutes: 25, maxConcurrency: 4, includeReasoningTrace: true, captureEvidence: true, notifyOnCompletion: true }
    }),
    testSuites: ['OWASP Top 10 for LLM Applications', 'Prompt Injection', 'Hallucination'],
    durationMinutes: 18,
    startedAt: '2026-08-01T09:30:00.000Z',
    completedAt: '2026-08-01T09:48:00.000Z',
    createdAt: '2026-08-01T09:30:00.000Z',
    updatedAt: '2026-08-01T09:48:00.000Z'
  },
  {
    id: 'eval-002',
    name: 'Claude Enterprise Agent Review',
    description: 'Evaluation of the Anthropic-backed enterprise agent in regulated operations.',
    aiSystemName: 'Claude Enterprise Agent',
    aiSystemId: 'sys-claude',
    modelVersion: 'claude-3.7',
    model: 'Claude 3.7',
    deploymentContext: 'Hybrid',
    pillars: ['Security', 'Reliability', 'Fairness'],
    status: EvaluationStatus.Running,
    stage: 'Executing Tests',
    summary: 'The evaluation is actively exercising prompts and monitoring tool-use boundaries.',
    assuranceScore: { overall: 78, security: 80, safety: 77, reliability: 76, fairness: 74, domain: 80 },
    evidence: [],
    recommendations: [],
    progress: {
      percentage: 54,
      currentStage: 'Executing Tests',
      completedStages: ['Initializing', 'Preparing Environment'],
      activeTests: ['MITRE ATLAS', 'Tool Abuse', 'RAG Security'],
      logs: ['Environment prepared.', 'Executing adversarial test suite.']
    },
    configuration: buildConfiguration({
      aiSystemId: 'sys-claude',
      aiSystemName: 'Claude Enterprise Agent',
      modelVersion: 'claude-3.7',
      model: 'Claude 3.7',
      deploymentContext: 'Hybrid',
      pillars: ['Security', 'Reliability', 'Fairness'],
      profile: 'Red Team',
      testSuites: ['MITRE ATLAS', 'Tool Abuse', 'RAG Security'],
      runtimeOptions: { timeoutMinutes: 30, maxConcurrency: 3, includeReasoningTrace: true, captureEvidence: true, notifyOnCompletion: true }
    }),
    testSuites: ['MITRE ATLAS', 'Tool Abuse', 'RAG Security'],
    durationMinutes: 11,
    startedAt: '2026-08-02T08:15:00.000Z',
    completedAt: null,
    createdAt: '2026-08-02T08:15:00.000Z',
    updatedAt: '2026-08-02T08:15:00.000Z'
  },
  {
    id: 'eval-003',
    name: 'Customer Support Agent Review',
    description: 'Coverage for the customer support copilot operating across CRM and knowledge workflows.',
    aiSystemName: 'Customer Support Agent',
    aiSystemId: 'sys-support',
    modelVersion: 'v3.2',
    model: 'Support Copilot',
    deploymentContext: 'Cloud',
    pillars: ['Security', 'Safety', 'Domain'],
    status: EvaluationStatus.Queued,
    stage: 'Initializing',
    summary: 'Queued for execution after the latest policy sync.',
    assuranceScore: { overall: 0, security: 0, safety: 0, reliability: 0, fairness: 0, domain: 0 },
    evidence: [],
    recommendations: [],
    progress: {
      percentage: 8,
      currentStage: 'Initializing',
      completedStages: [],
      activeTests: [],
      logs: ['Queued for execution.']
    },
    configuration: buildConfiguration({
      aiSystemId: 'sys-support',
      aiSystemName: 'Customer Support Agent',
      modelVersion: 'v3.2',
      model: 'Support Copilot',
      deploymentContext: 'Cloud',
      pillars: ['Security', 'Safety', 'Domain'],
      profile: 'Standard',
      testSuites: ['Prompt Injection', 'Hallucination', 'Fairness'],
      runtimeOptions: { timeoutMinutes: 20, maxConcurrency: 2, includeReasoningTrace: true, captureEvidence: true, notifyOnCompletion: true }
    }),
    testSuites: ['Prompt Injection', 'Hallucination', 'Fairness'],
    durationMinutes: 0,
    startedAt: '',
    completedAt: null,
    createdAt: '2026-08-02T06:45:00.000Z',
    updatedAt: '2026-08-02T06:45:00.000Z'
  },
  {
    id: 'eval-004',
    name: 'Financial Risk Assistant Review',
    description: 'Compliance review for the finance risk assistant in high-stakes procurement workflows.',
    aiSystemName: 'Financial Risk Assistant',
    aiSystemId: 'sys-finance',
    modelVersion: 'v1.4',
    model: 'Finance Risk Copilot',
    deploymentContext: 'On-prem',
    pillars: ['Security', 'Reliability', 'Fairness', 'Domain'],
    status: EvaluationStatus.Failed,
    stage: 'Failed',
    summary: 'The run hit a runtime dependency and needs to be retried.',
    assuranceScore: { overall: 42, security: 44, safety: 39, reliability: 41, fairness: 43, domain: 45 },
    evidence: [],
    recommendations: [],
    progress: {
      percentage: 40,
      currentStage: 'Failed',
      completedStages: ['Initializing', 'Preparing Environment'],
      activeTests: ['Prompt Leakage'],
      logs: ['Runtime dependency failed during test execution.']
    },
    configuration: buildConfiguration({
      aiSystemId: 'sys-finance',
      aiSystemName: 'Financial Risk Assistant',
      modelVersion: 'v1.4',
      model: 'Finance Risk Copilot',
      deploymentContext: 'On-prem',
      pillars: ['Security', 'Reliability', 'Fairness', 'Domain'],
      profile: 'Compliance',
      testSuites: ['MITRE ATLAS', 'Prompt Leakage', 'Reliability'],
      runtimeOptions: { timeoutMinutes: 45, maxConcurrency: 2, includeReasoningTrace: false, captureEvidence: true, notifyOnCompletion: true }
    }),
    testSuites: ['MITRE ATLAS', 'Prompt Leakage', 'Reliability'],
    durationMinutes: 9,
    startedAt: '2026-08-01T14:20:00.000Z',
    completedAt: null,
    createdAt: '2026-08-01T14:20:00.000Z',
    updatedAt: '2026-08-01T14:20:00.000Z'
  },
  {
    id: 'eval-005',
    name: 'Internal HR Assistant Review',
    description: 'Validation of the HR assistant handling handbook and policy retrieval tasks.',
    aiSystemName: 'Internal HR Assistant',
    aiSystemId: 'sys-hr',
    modelVersion: 'v2.1',
    model: 'HR Assistant',
    deploymentContext: 'Hybrid',
    pillars: ['Safety', 'Reliability', 'Fairness', 'Domain'],
    status: EvaluationStatus.Completed,
    stage: 'Completed',
    summary: 'The review completed with a 87/100 assurance score and low residual risk.',
    assuranceScore: { overall: 87, security: 84, safety: 89, reliability: 88, fairness: 83, domain: 90 },
    evidence: [],
    recommendations: [],
    progress: {
      percentage: 100,
      currentStage: 'Completed',
      completedStages: ['Initializing', 'Preparing Environment', 'Executing Tests', 'Collecting Evidence', 'Calculating Scores', 'Building Report', 'Completed'],
      activeTests: ['Hallucination', 'Memory Poisoning'],
      logs: ['Completed.', 'Report delivered.']
    },
    configuration: buildConfiguration({
      aiSystemId: 'sys-hr',
      aiSystemName: 'Internal HR Assistant',
      modelVersion: 'v2.1',
      model: 'HR Assistant',
      deploymentContext: 'Hybrid',
      pillars: ['Safety', 'Reliability', 'Fairness', 'Domain'],
      profile: 'Compliance',
      testSuites: ['Memory Poisoning', 'Prompt Leakage', 'Fairness'],
      runtimeOptions: { timeoutMinutes: 20, maxConcurrency: 3, includeReasoningTrace: true, captureEvidence: true, notifyOnCompletion: false }
    }),
    testSuites: ['Memory Poisoning', 'Prompt Leakage', 'Fairness'],
    durationMinutes: 14,
    startedAt: '2026-07-31T10:00:00.000Z',
    completedAt: '2026-07-31T10:14:00.000Z',
    createdAt: '2026-07-31T10:00:00.000Z',
    updatedAt: '2026-07-31T10:14:00.000Z'
  }
]

function buildConfiguration(input: Partial<EvaluationConfiguration> & { aiSystemId: string; aiSystemName: string; modelVersion: string; model: string; deploymentContext: string; pillars: string[]; profile?: EvaluationProfile; testSuites?: string[]; runtimeOptions?: EvaluationRuntimeOptions }): EvaluationConfiguration {
  return {
    aiSystemId: input.aiSystemId,
    aiSystemName: input.aiSystemName,
    model: input.model,
    modelVersion: input.modelVersion,
    profile: (input.profile ?? 'Standard') as EvaluationProfile,
    pillars: input.pillars as Evaluation['pillars'],
    testSuites: input.testSuites ?? ['Prompt Injection', 'Hallucination'],
    runtimeOptions: input.runtimeOptions ?? {
      timeoutMinutes: 20,
      maxConcurrency: 3,
      includeReasoningTrace: true,
      captureEvidence: true,
      notifyOnCompletion: true
    }
  }
}

function buildProgress(status: EvaluationStatus, existing?: EvaluationProgress): EvaluationProgress {
  if (status === EvaluationStatus.Paused) {
    return {
      percentage: existing?.percentage ?? 54,
      currentStage: 'Paused',
      completedStages: existing?.completedStages ?? [],
      activeTests: existing?.activeTests ?? [],
      logs: existing?.logs ? [...existing.logs, 'Evaluation paused.'] : ['Evaluation paused.']
    }
  }

  if (status === EvaluationStatus.Completed) {
    return {
      percentage: 100,
      currentStage: 'Completed',
      completedStages: ['Initializing', 'Preparing Environment', 'Executing Tests', 'Collecting Evidence', 'Calculating Scores', 'Building Report', 'Completed'],
      activeTests: [],
      logs: existing?.logs ? [...existing.logs, 'Evaluation completed.'] : ['Evaluation completed.']
    }
  }

  if (status === EvaluationStatus.Failed) {
    return {
      percentage: existing?.percentage ?? 42,
      currentStage: 'Failed',
      completedStages: existing?.completedStages ?? ['Initializing', 'Preparing Environment'],
      activeTests: existing?.activeTests ?? ['Prompt Leakage'],
      logs: existing?.logs ? [...existing.logs, 'Evaluation failed.'] : ['Evaluation failed.']
    }
  }

  if (status === EvaluationStatus.Cancelled) {
    return {
      percentage: existing?.percentage ?? 34,
      currentStage: 'Cancelled',
      completedStages: existing?.completedStages ?? ['Initializing'],
      activeTests: [],
      logs: existing?.logs ? [...existing.logs, 'Evaluation cancelled.'] : ['Evaluation cancelled.']
    }
  }

  return {
    percentage: existing?.percentage ?? 18,
    currentStage: 'Preparing Environment' as EvaluationStage,
    completedStages: existing?.completedStages ?? ['Initializing'],
    activeTests: existing?.activeTests ?? ['Prompt Injection'],
    logs: existing?.logs ?? ['Preparing evaluation environment.']
  }
}

function applyLifecycle(evaluation: Evaluation): Evaluation {
  return {
    ...evaluation,
    status: evaluation.status ?? EvaluationStatus.Draft,
    stage: evaluation.stage ?? 'Initializing',
    progress: evaluation.progress ?? buildProgress(evaluation.status ?? EvaluationStatus.Queued),
    lifecycle: buildLifecycleState(evaluation.status ?? EvaluationStatus.Draft, evaluation.updatedAt, evaluation.createdAt)
  }
}

function createId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`
}

function buildMockEvaluation(input: EvaluationCreateInput): Evaluation {
  const now = new Date().toISOString()
  const config: EvaluationConfiguration = {
    aiSystemId: input.aiSystemId,
    aiSystemName: input.aiSystemName,
    model: input.model ?? input.modelVersion,
    modelVersion: input.modelVersion,
    profile: input.profile ?? 'Standard',
    pillars: input.pillars,
    testSuites: input.testSuites ?? ['OWASP Top 10 for LLM Applications', 'Prompt Injection', 'Hallucination'],
    runtimeOptions: input.runtimeOptions ?? { timeoutMinutes: 20, maxConcurrency: 3, includeReasoningTrace: true, captureEvidence: true, notifyOnCompletion: true }
  }

  return applyLifecycle({
    id: createId('eval'),
    name: input.name,
    description: input.description,
    aiSystemName: input.aiSystemName,
    aiSystemId: input.aiSystemId,
    modelVersion: input.modelVersion,
    model: input.model ?? input.modelVersion,
    deploymentContext: input.deploymentContext,
    pillars: input.pillars,
    status: EvaluationStatus.Queued,
    stage: 'Initializing',
    summary: `${input.name} is ready to begin.`,
    assuranceScore: { overall: 0, security: 0, safety: 0, reliability: 0, fairness: 0, domain: 0 },
    evidence: [],
    recommendations: [],
    progress: buildProgress(EvaluationStatus.Queued),
    configuration: config,
    testSuites: config.testSuites,
    durationMinutes: 0,
    startedAt: '',
    completedAt: null,
    createdAt: now,
    updatedAt: now
  })
}

function persistEvaluation(evaluation: Evaluation): Evaluation {
  const next = applyLifecycle(evaluation)
  mockEvaluations = mockEvaluations.filter((item) => item.id !== next.id)
  mockEvaluations = [next, ...mockEvaluations]
  return next
}

async function requestWithFallback<T>(request: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await request()
  } catch {
    return fallback
  }
}

export async function getEvaluations(signal?: AbortSignal): Promise<Evaluation[]> {
  const data = await requestWithFallback<Evaluation[]>(async () => {
    const response = await get<Evaluation[]>('/evaluations', signal)
    return response
  }, mockEvaluations)
  return data.map((evaluation) => applyLifecycle(evaluation))
}

export async function listEvaluations(signal?: AbortSignal): Promise<Evaluation[]> {
  return getEvaluations(signal)
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
  const created = await requestWithFallback<Evaluation>(async () => {
    const response = await post<Evaluation, EvaluationCreateInput>('/evaluations', input, signal)
    return response
  }, buildMockEvaluation(input))
  return persistEvaluation({ ...created, status: EvaluationStatus.Queued, stage: 'Initializing', progress: buildProgress(EvaluationStatus.Queued, created.progress) })
}

export async function startEvaluation(id: string, signal?: AbortSignal): Promise<Evaluation> {
  const evaluation = await getEvaluationById(id, signal)
  if (!evaluation) {
    throw new Error('Evaluation not found.')
  }

  const started = applyLifecycle({
    ...evaluation,
    status: EvaluationStatus.Running,
    stage: 'Preparing Environment',
    progress: buildProgress(EvaluationStatus.Running, evaluation.progress),
    startedAt: evaluation.startedAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })
  return persistEvaluation(started)
}

export async function pauseEvaluation(id: string, signal?: AbortSignal): Promise<Evaluation> {
  const evaluation = await getEvaluationById(id, signal)
  if (!evaluation) {
    throw new Error('Evaluation not found.')
  }

  const paused = applyLifecycle({
    ...evaluation,
    status: EvaluationStatus.Paused,
    stage: 'Paused',
    progress: buildProgress(EvaluationStatus.Paused, evaluation.progress),
    updatedAt: new Date().toISOString()
  })
  return persistEvaluation(paused)
}

export async function resumeEvaluation(id: string, signal?: AbortSignal): Promise<Evaluation> {
  const evaluation = await getEvaluationById(id, signal)
  if (!evaluation) {
    throw new Error('Evaluation not found.')
  }

  const resumed = applyLifecycle({
    ...evaluation,
    status: EvaluationStatus.Running,
    stage: 'Executing Tests',
    progress: buildProgress(EvaluationStatus.Running, evaluation.progress),
    updatedAt: new Date().toISOString()
  })
  return persistEvaluation(resumed)
}

export async function cancelEvaluation(id: string, signal?: AbortSignal): Promise<Evaluation> {
  const evaluation = await getEvaluationById(id, signal)
  if (!evaluation) {
    throw new Error('Evaluation not found.')
  }

  const cancelled = applyLifecycle({
    ...evaluation,
    status: EvaluationStatus.Cancelled,
    stage: 'Cancelled',
    progress: buildProgress(EvaluationStatus.Cancelled, evaluation.progress),
    updatedAt: new Date().toISOString()
  })
  return persistEvaluation(cancelled)
}

export async function retryEvaluation(id: string, signal?: AbortSignal): Promise<Evaluation> {
  const evaluation = await getEvaluationById(id, signal)
  if (!evaluation) {
    throw new Error('Evaluation not found.')
  }

  const retried = applyLifecycle({
    ...evaluation,
    id: createId('eval'),
    status: EvaluationStatus.Queued,
    stage: 'Initializing',
    progress: buildProgress(EvaluationStatus.Queued, evaluation.progress),
    startedAt: '',
    completedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })

  return persistEvaluation(retried)
}

export async function getEvaluationById(id: string, signal?: AbortSignal): Promise<Evaluation | null> {
  try {
    const data = await requestWithFallback<Evaluation>(async () => {
      const evaluation = await get<Evaluation>(`/evaluations/${encodeURIComponent(id)}`, signal)
      return evaluation
    }, mockEvaluations.find((evaluation) => evaluation.id === id) as Evaluation)
    if (!data) {
      return null
    }
    return applyLifecycle(data)
  } catch {
    return null
  }
}

export async function getEvaluation(id: string, signal?: AbortSignal): Promise<Evaluation | null> {
  return getEvaluationById(id, signal)
}

export async function getEvaluationProgress(id: string, signal?: AbortSignal): Promise<Evaluation | null> {
  const evaluation = await getEvaluationById(id, signal)
  if (!evaluation) {
    return null
  }

  if (evaluation.status === EvaluationStatus.Running) {
    const stageSequence: EvaluationStage[] = ['Preparing Environment', 'Executing Tests', 'Collecting Evidence', 'Calculating Scores', 'Building Report', 'Completed']
    const nextIndex = Math.min(stageSequence.indexOf(evaluation.progress.currentStage) + 1, stageSequence.length - 1)
    const nextStage = stageSequence[nextIndex]
    const nextPercent = Math.min(100, evaluation.progress.percentage + 12)

    const updated = applyLifecycle({
      ...evaluation,
      status: nextPercent >= 100 ? EvaluationStatus.Completed : EvaluationStatus.Running,
      stage: nextPercent >= 100 ? 'Completed' : nextStage,
      progress: {
        percentage: nextPercent,
        currentStage: nextPercent >= 100 ? 'Completed' : nextStage,
        completedStages: [...new Set([...(evaluation.progress.completedStages ?? []), evaluation.progress.currentStage])],
        activeTests: evaluation.progress.activeTests.length > 0 ? evaluation.progress.activeTests : ['Prompt Injection'],
        logs: [...evaluation.progress.logs, `Advanced to ${nextPercent >= 100 ? 'Completed' : nextStage}.`]
      },
      updatedAt: new Date().toISOString()
    })

    return persistEvaluation(updated)
  }

  return evaluation
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
