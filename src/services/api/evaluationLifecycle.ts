import { EvaluationStatus, type EvaluationLifecycleState, type EvaluationLifecycleStep } from '../../types'

const lifecycleSteps: Array<Omit<EvaluationLifecycleStep, 'completed'>> = [
  { key: EvaluationStatus.Draft, title: 'Queued', description: 'The evaluation has been created and is waiting to begin.' },
  { key: EvaluationStatus.Queued, title: 'Discovery', description: 'Preparing the assurance runtime and context for the target AI system.' },
  { key: EvaluationStatus.Initializing, title: 'Evaluation', description: 'Executing the configured assurance checks and evaluation suite.' },
  { key: EvaluationStatus.Running, title: 'Adversarial testing', description: 'Exercising the system with targeted challenge scenarios.' },
  { key: EvaluationStatus.CollectingEvidence, title: 'Evidence collection', description: 'Gathering evidence, findings, and supporting artifacts.' },
  { key: EvaluationStatus.CalculatingScores, title: 'Assurance scoring', description: 'Scoring the evidence across the five assurance pillars.' },
  { key: EvaluationStatus.GeneratingReport, title: 'Report generation', description: 'Assembling the assurance report and recommendations.' },
  { key: EvaluationStatus.Completed, title: 'Completed', description: 'The evaluation finished successfully.' }
]

const statusOrder = lifecycleSteps.map((step) => step.key)

export function buildLifecycleState(currentStatus: EvaluationStatus, updatedAt: string, startedAt: string | null): EvaluationLifecycleState {
  const steps = statusOrder.map((stepKey) => {
    const stepIndex = statusOrder.indexOf(stepKey)
    const currentIndex = statusOrder.indexOf(currentStatus)
    const completed = currentIndex > stepIndex || currentStatus === EvaluationStatus.Completed && stepIndex <= statusOrder.indexOf(EvaluationStatus.Completed)
    return {
      key: stepKey,
      title: lifecycleSteps.find((step) => step.key === stepKey)?.title ?? stepKey,
      description: lifecycleSteps.find((step) => step.key === stepKey)?.description ?? '',
      completed
    }
  })

  const progressMap: Record<EvaluationStatus, number> = {
    [EvaluationStatus.Draft]: 0,
    [EvaluationStatus.Queued]: 12,
    [EvaluationStatus.Initializing]: 24,
    [EvaluationStatus.Running]: 46,
    [EvaluationStatus.CollectingEvidence]: 64,
    [EvaluationStatus.CalculatingScores]: 80,
    [EvaluationStatus.GeneratingReport]: 92,
    [EvaluationStatus.Completed]: 100,
    [EvaluationStatus.Failed]: 0,
    [EvaluationStatus.Cancelled]: 0,
    [EvaluationStatus.Paused]: 54
  }

  return {
    currentStatus,
    progress: progressMap[currentStatus] ?? 0,
    steps,
    startedAt,
    updatedAt,
    completedAt: currentStatus === EvaluationStatus.Completed ? updatedAt : null
  }
}
