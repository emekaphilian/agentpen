import { EvaluationStatus, type EvaluationLifecycleState, type EvaluationLifecycleStep } from '../../types'

const lifecycleSteps: Array<Omit<EvaluationLifecycleStep, 'completed'>> = [
  { key: EvaluationStatus.Draft, title: 'Draft', description: 'The evaluation has been created but not yet queued.' },
  { key: EvaluationStatus.Queued, title: 'Queued', description: 'The evaluation has been accepted for execution.' },
  { key: EvaluationStatus.Initializing, title: 'Initializing', description: 'Preparing the assurance runtime and context.' },
  { key: EvaluationStatus.Running, title: 'Running', description: 'The evaluation is executing checks and probes.' },
  { key: EvaluationStatus.CollectingEvidence, title: 'Collecting evidence', description: 'Evidence is being gathered for the review.' },
  { key: EvaluationStatus.CalculatingScores, title: 'Calculating scores', description: 'Assurance scores are being calculated.' },
  { key: EvaluationStatus.GeneratingReport, title: 'Generating report', description: 'The final report is being assembled.' },
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
    [EvaluationStatus.Cancelled]: 0
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
