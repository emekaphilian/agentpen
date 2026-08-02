import { EvaluationStatus, type EvaluationLifecycleState, type EvaluationLifecycleStep } from '../../types'

const lifecycleSteps: Array<Omit<EvaluationLifecycleStep, 'completed'>> = [
  { key: EvaluationStatus.Draft, title: 'Queued', description: 'The evaluation has been created and is waiting to begin.' },
  { key: EvaluationStatus.Queued, title: 'Queued', description: 'The evaluation is positioned in the assurance queue.' },
  { key: EvaluationStatus.Initializing, title: 'Initializing', description: 'Initializing the evaluator, credentials, and runtime prerequisites.' },
  { key: EvaluationStatus.Discovery, title: 'Discovery', description: 'Mapping the AI system, framework coverage, and target controls.' },
  { key: EvaluationStatus.PreparingEnvironment, title: 'Preparing Environment', description: 'Preparing the sandboxed execution environment and dependencies.' },
  { key: EvaluationStatus.RunningSecurityAssurance, title: 'Running Security Assurance', description: 'Executing the security assurance suite against the target AI system.' },
  { key: EvaluationStatus.RunningSafetyAssurance, title: 'Running Safety Assurance', description: 'Testing the safety posture, prompt controls, and refusal quality.' },
  { key: EvaluationStatus.RunningReliabilityAssurance, title: 'Running Reliability Assurance', description: 'Checking resilience, consistency, and operational reliability.' },
  { key: EvaluationStatus.RunningFairnessAssurance, title: 'Running Fairness Assurance', description: 'Testing for representative, balanced, and fair outcomes.' },
  { key: EvaluationStatus.RunningDomainAssurance, title: 'Running Domain Assurance', description: 'Assessing domain-specific controls and regulated workflows.' },
  { key: EvaluationStatus.EvidenceCollection, title: 'Evidence Collection', description: 'Collecting artifacts, traces, and findings from the assessment.' },
  { key: EvaluationStatus.EvidenceValidation, title: 'Evidence Validation', description: 'Validating evidence quality, integrity, and coverage.' },
  { key: EvaluationStatus.AssuranceCalculation, title: 'Assurance Calculation', description: 'Computing the assurance score and residual risk posture.' },
  { key: EvaluationStatus.ReportGeneration, title: 'Report Generation', description: 'Assembling the assurance report and recommendations.' },
  { key: EvaluationStatus.PublishingResults, title: 'Publishing Results', description: 'Publishing signed results and evidence package.' },
  { key: EvaluationStatus.Completed, title: 'Completed', description: 'The evaluation finished successfully.' },
  { key: EvaluationStatus.Failed, title: 'Failed', description: 'The evaluation failed and requires remediation.' },
  { key: EvaluationStatus.Cancelled, title: 'Cancelled', description: 'The evaluation was cancelled.' },
  { key: EvaluationStatus.Paused, title: 'Paused', description: 'The evaluation is temporarily paused.' }
]

const statusOrder = lifecycleSteps.map((step) => step.key)

export function buildLifecycleState(currentStatus: EvaluationStatus, updatedAt: string, startedAt: string | null): EvaluationLifecycleState {
  const safeStatus = statusOrder.includes(currentStatus) ? currentStatus : EvaluationStatus.Queued
  const steps = statusOrder.map((stepKey) => {
    const stepIndex = statusOrder.indexOf(stepKey)
    const currentIndex = statusOrder.indexOf(safeStatus)
    const completed = currentIndex > stepIndex || (safeStatus === EvaluationStatus.Completed && stepIndex <= statusOrder.indexOf(EvaluationStatus.Completed))
    return {
      key: stepKey,
      title: lifecycleSteps.find((step) => step.key === stepKey)?.title ?? stepKey,
      description: lifecycleSteps.find((step) => step.key === stepKey)?.description ?? '',
      completed
    }
  })

  const progressMap: Record<EvaluationStatus, number> = {
    [EvaluationStatus.Draft]: 0,
    [EvaluationStatus.Queued]: 8,
    [EvaluationStatus.Initializing]: 16,
    [EvaluationStatus.Discovery]: 28,
    [EvaluationStatus.PreparingEnvironment]: 38,
    [EvaluationStatus.Running]: 52,
    [EvaluationStatus.RunningSecurityAssurance]: 52,
    [EvaluationStatus.RunningSafetyAssurance]: 60,
    [EvaluationStatus.RunningReliabilityAssurance]: 68,
    [EvaluationStatus.RunningFairnessAssurance]: 76,
    [EvaluationStatus.RunningDomainAssurance]: 82,
    [EvaluationStatus.EvidenceCollection]: 86,
    [EvaluationStatus.EvidenceValidation]: 89,
    [EvaluationStatus.AssuranceCalculation]: 93,
    [EvaluationStatus.ReportGeneration]: 96,
    [EvaluationStatus.PublishingResults]: 98,
    [EvaluationStatus.Completed]: 100,
    [EvaluationStatus.Failed]: 0,
    [EvaluationStatus.Cancelled]: 0,
    [EvaluationStatus.Paused]: 54,
    [EvaluationStatus.Published]: 100
  }

  return {
    currentStatus: safeStatus,
    progress: progressMap[safeStatus] ?? 0,
    steps,
    startedAt,
    updatedAt,
    completedAt: safeStatus === EvaluationStatus.Completed || safeStatus === EvaluationStatus.Published ? updatedAt : null
  }
}
