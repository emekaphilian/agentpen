import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Drawer } from '../../components/ui/Drawer'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { useNotifications } from '../../components/ui/NotificationContext'
import { Table, TableCell, TableHeader, TableHeaderCell, TableRow } from '../../components/ui/Table'
import { createEvaluation, getEmptyEvaluationState, getEvaluationById, getEvaluationProgress, getEvaluations, pauseEvaluation, resumeEvaluation, cancelEvaluation, retryEvaluation, startEvaluation } from '../../services/api/evaluations'
import { buildLifecycleState } from '../../services/api/evaluationLifecycle'
import { getMockEvidence } from '../../services/api/evidence'
import { EvaluationStatus } from '../../types'
import type { AssurancePillar, Evaluation, EvaluationCreateInput, EvaluationProfile, EvaluationRuntimeOptions, Evidence } from '../../types'
import { AssuranceDashboard } from '../assurance/AssuranceDashboard'
import { EvidenceViewer } from '../evidence/EvidenceViewer'
import { EvaluationConfiguration } from './EvaluationConfiguration'
import { EvaluationProgress } from './EvaluationProgress'
import { EvaluationResults } from './EvaluationResults'
import { EvaluationSummary } from './EvaluationSummary'

interface PrefillState {
  id?: string
  name?: string
  description?: string
  version?: string
  provider?: string
  endpoint?: string
  assetType?: string
}

const defaultDraft: EvaluationCreateInput = {
  name: 'Fresh Assurance Review',
  description: 'Assess the current deployment against the core assurance pillars and collect evidence for follow-up remediation.',
  aiSystemName: 'GPT-4.1 Enterprise Assistant',
  aiSystemId: 'sys-gpt41',
  modelVersion: 'gpt-4.1-2026-04',
  model: 'GPT-4.1',
  deploymentContext: 'Cloud',
  pillars: ['Security', 'Safety', 'Reliability'],
  profile: 'Standard',
  testSuites: ['OWASP Top 10 for LLM Applications', 'Prompt Injection', 'Hallucination'],
  runtimeOptions: {
    timeoutMinutes: 25,
    maxConcurrency: 3,
    includeReasoningTrace: true,
    captureEvidence: true,
    notifyOnCompletion: true
  }
}

const pillarOptions: AssurancePillar[] = ['Security', 'Safety', 'Reliability', 'Fairness', 'Domain']

const liveStageOrder = [
  EvaluationStatus.Queued,
  EvaluationStatus.Initializing,
  EvaluationStatus.Discovery,
  EvaluationStatus.PreparingEnvironment,
  EvaluationStatus.RunningSecurityAssurance,
  EvaluationStatus.RunningSafetyAssurance,
  EvaluationStatus.RunningReliabilityAssurance,
  EvaluationStatus.RunningFairnessAssurance,
  EvaluationStatus.RunningDomainAssurance,
  EvaluationStatus.EvidenceCollection,
  EvaluationStatus.EvidenceValidation,
  EvaluationStatus.AssuranceCalculation,
  EvaluationStatus.ReportGeneration,
  EvaluationStatus.PublishingResults,
  EvaluationStatus.Completed
] as const

const liveStageDescriptions: Record<string, { title: string; description: string; icon: string }> = {
  [EvaluationStatus.Queued]: { title: 'Queued', description: 'Evaluation accepted and waiting for execution.', icon: '⏳' },
  [EvaluationStatus.Initializing]: { title: 'Initializing', description: 'Provisioning runtime, credentials, and execution context.', icon: '⚙️' },
  [EvaluationStatus.Discovery]: { title: 'Discovery', description: 'Mapping the AI system, frameworks, and control scope.', icon: '🔎' },
  [EvaluationStatus.PreparingEnvironment]: { title: 'Preparing Environment', description: 'Preparing the sandbox and policy runtime.', icon: '🧰' },
  [EvaluationStatus.RunningSecurityAssurance]: { title: 'Security Assurance', description: 'Running security probes and control validation.', icon: '🛡️' },
  [EvaluationStatus.RunningSafetyAssurance]: { title: 'Safety Assurance', description: 'Executing safety and refusal quality checks.', icon: '🧯' },
  [EvaluationStatus.RunningReliabilityAssurance]: { title: 'Reliability Assurance', description: 'Testing resilience and consistency under stress.', icon: '📈' },
  [EvaluationStatus.RunningFairnessAssurance]: { title: 'Fairness Assurance', description: 'Assessing fairness, representativeness, and bias risk.', icon: '⚖️' },
  [EvaluationStatus.RunningDomainAssurance]: { title: 'Domain Assurance', description: 'Reviewing domain-specific controls and requirements.', icon: '🏛️' },
  [EvaluationStatus.EvidenceCollection]: { title: 'Evidence Collection', description: 'Capturing audit artifacts and test evidence.', icon: '🧾' },
  [EvaluationStatus.EvidenceValidation]: { title: 'Evidence Validation', description: 'Validating artifact quality and evidence integrity.', icon: '✅' },
  [EvaluationStatus.AssuranceCalculation]: { title: 'Assurance Calculation', description: 'Computing assurance scores and residual risk.', icon: '📊' },
  [EvaluationStatus.ReportGeneration]: { title: 'Report Generation', description: 'Compiling the assurance narrative and recommendations.', icon: '📝' },
  [EvaluationStatus.PublishingResults]: { title: 'Publishing Results', description: 'Publishing the signed report and evidence package.', icon: '🚀' },
  [EvaluationStatus.Completed]: { title: 'Completed', description: 'Evaluation completed successfully.', icon: '🎯' },
  [EvaluationStatus.Failed]: { title: 'Failed', description: 'Evaluation failed and requires remediation.', icon: '⛔' },
  [EvaluationStatus.Cancelled]: { title: 'Cancelled', description: 'Evaluation cancelled by operator action.', icon: '🚫' },
  [EvaluationStatus.Paused]: { title: 'Paused', description: 'Evaluation is paused and ready to resume.', icon: '⏸️' },
  [EvaluationStatus.Published]: { title: 'Published', description: 'Results have been published to stakeholders.', icon: '📣' }
}

function buildDraftFromPrefill(prefill?: PrefillState): EvaluationCreateInput {
  if (!prefill) {
    return defaultDraft
  }

  return {
    ...defaultDraft,
    name: `${prefill.name ?? 'Assurance Review'} Evaluation`,
    description: `Assess ${prefill.name ?? 'the selected AI system'} using the configured assurance pillars and evidence workflow.`,
    aiSystemName: prefill.name ?? defaultDraft.aiSystemName,
    aiSystemId: prefill.id ?? defaultDraft.aiSystemId,
    modelVersion: prefill.version ?? defaultDraft.modelVersion,
    deploymentContext: 'Cloud',
    pillars: ['Security', 'Reliability', 'Safety']
  }
}

function getStatusTone(status: Evaluation['status']) {
  switch (status) {
    case EvaluationStatus.Completed:
    case EvaluationStatus.Published:
      return 'healthy'
    case EvaluationStatus.Running:
    case EvaluationStatus.RunningSecurityAssurance:
    case EvaluationStatus.RunningSafetyAssurance:
    case EvaluationStatus.RunningReliabilityAssurance:
    case EvaluationStatus.RunningFairnessAssurance:
    case EvaluationStatus.RunningDomainAssurance:
      return 'at-risk'
    case EvaluationStatus.Queued:
    case EvaluationStatus.Initializing:
    case EvaluationStatus.Discovery:
    case EvaluationStatus.PreparingEnvironment:
    case EvaluationStatus.Paused:
    case EvaluationStatus.Draft:
      return 'warning'
    case EvaluationStatus.Failed:
    case EvaluationStatus.Cancelled:
      return 'offline'
    default:
      return 'offline'
  }
}

export function EvaluationWizard() {
  const location = useLocation()
  const navigate = useNavigate()
  const [draft, setDraft] = useState<EvaluationCreateInput>(() => buildDraftFromPrefill((location.state as { prefill?: PrefillState } | null)?.prefill))
  const [step, setStep] = useState<'configuration' | 'summary' | 'progress' | 'results'>('configuration')
  const [evaluationsState, setEvaluationsState] = useState(() => getEmptyEvaluationState())
  const [activeEvaluation, setActiveEvaluation] = useState<Evaluation | null>(null)
  const [selectedEvaluationId, setSelectedEvaluationId] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [submissionError, setSubmissionError] = useState<string | null>(null)
  const [isLaunching, setIsLaunching] = useState(false)
  const [isPolling, setIsPolling] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerMode, setDrawerMode] = useState<'details' | 'assurance' | 'evidence'>('details')
  const [evidence, setEvidence] = useState<Evidence[]>([])
  const { showNotification } = useNotifications()

  useEffect(() => {
    const controller = new AbortController()

    const loadEvaluations = async () => {
      setEvaluationsState((current) => ({ ...current, loading: true, error: null }))
      try {
        const items = await getEvaluations(controller.signal)
        setEvaluationsState({ data: items, loading: false, error: null })
      } catch (error) {
        setEvaluationsState({ data: [], loading: false, error: error instanceof Error ? error.message : 'Unable to load evaluations.' })
      }
    }

    void loadEvaluations()
    return () => controller.abort()
  }, [])

  useEffect(() => {
    const prefill = (location.state as { prefill?: PrefillState } | undefined)?.prefill
    setDraft(buildDraftFromPrefill(prefill))
    setStep('configuration')
  }, [location.state])

  useEffect(() => {
    if (!selectedEvaluationId) {
      return
    }

    const loadEvidence = async () => {
      try {
        const items = await getMockEvidence(selectedEvaluationId ?? undefined)
        setEvidence(items.filter((item) => item.evaluationId === selectedEvaluationId || item.evaluationId === 'eval-001'))
      } catch {
        setEvidence([])
      }
    }

    void loadEvidence()
  }, [selectedEvaluationId])

  useEffect(() => {
    const pollStatuses = new Set<EvaluationStatus>([
      EvaluationStatus.Queued,
      EvaluationStatus.Initializing,
      EvaluationStatus.Discovery,
      EvaluationStatus.PreparingEnvironment,
      EvaluationStatus.Running,
      EvaluationStatus.RunningSecurityAssurance,
      EvaluationStatus.RunningSafetyAssurance,
      EvaluationStatus.RunningReliabilityAssurance,
      EvaluationStatus.RunningFairnessAssurance,
      EvaluationStatus.RunningDomainAssurance,
      EvaluationStatus.EvidenceCollection,
      EvaluationStatus.EvidenceValidation,
      EvaluationStatus.AssuranceCalculation,
      EvaluationStatus.ReportGeneration,
      EvaluationStatus.PublishingResults,
      EvaluationStatus.Paused
    ])

    if (!activeEvaluation || !pollStatuses.has(activeEvaluation.status)) {
      setIsPolling(false)
      return undefined
    }

    setIsPolling(true)
    let lastStatus = activeEvaluation.status
    const intervalId = window.setInterval(async () => {
      try {
        const updated = await getEvaluationProgress(activeEvaluation.id)
        if (!updated) {
          return
        }

        setActiveEvaluation(updated)
        updateEvaluationInState(updated)
        setProgress(updated.progress.percentage)

        if ([EvaluationStatus.Completed, EvaluationStatus.Failed, EvaluationStatus.Cancelled].includes(updated.status)) {
          setStep('results')
        }

        if (updated.status !== lastStatus && [EvaluationStatus.Completed, EvaluationStatus.Failed, EvaluationStatus.Cancelled].includes(updated.status)) {
          showNotification({
            title: `Evaluation ${updated.status.toLowerCase()}`,
            message: `${updated.name} has ${updated.status.toLowerCase()}.`,
            type: updated.status === EvaluationStatus.Completed ? 'success' : 'error'
          })
        }

        lastStatus = updated.status
      } catch {
        // Ignore transient polling failures; UI remains live and will update on the next tick.
      }
    }, 2800)

    return () => {
      window.clearInterval(intervalId)
      setIsPolling(false)
    }
  }, [activeEvaluation?.id, activeEvaluation?.status, showNotification])

  const selectedEvaluation = useMemo(() => {
    if (selectedEvaluationId) {
      return evaluationsState.data.find((item) => item.id === selectedEvaluationId) ?? activeEvaluation
    }
    return activeEvaluation
  }, [activeEvaluation, evaluationsState.data, selectedEvaluationId])

  const summary = useMemo(() => {
    const total = evaluationsState.data.length
    const running = evaluationsState.data.filter((item) => [
      EvaluationStatus.Queued,
      EvaluationStatus.Initializing,
      EvaluationStatus.Discovery,
      EvaluationStatus.PreparingEnvironment,
      EvaluationStatus.Running,
      EvaluationStatus.RunningSecurityAssurance,
      EvaluationStatus.RunningSafetyAssurance,
      EvaluationStatus.RunningReliabilityAssurance,
      EvaluationStatus.RunningFairnessAssurance,
      EvaluationStatus.RunningDomainAssurance,
      EvaluationStatus.EvidenceCollection,
      EvaluationStatus.EvidenceValidation,
      EvaluationStatus.AssuranceCalculation,
      EvaluationStatus.ReportGeneration,
      EvaluationStatus.PublishingResults,
      EvaluationStatus.Paused
    ].includes(item.status)).length
    const completed = evaluationsState.data.filter((item) => item.status === EvaluationStatus.Completed || item.status === EvaluationStatus.Published).length
    const failed = evaluationsState.data.filter((item) => item.status === EvaluationStatus.Failed).length
    const averageScore = total > 0 ? Math.round(evaluationsState.data.reduce((sum, item) => sum + item.assuranceScore.overall, 0) / total) : 0
    const averageDuration = total > 0 ? Math.round(evaluationsState.data.reduce((sum, item) => sum + item.durationMinutes, 0) / total) : 0

    return {
      totalEvaluations: total,
      runningEvaluations: running,
      completedEvaluations: completed,
      failedEvaluations: failed,
      averageAssuranceScore: averageScore,
      averageDurationMinutes: averageDuration
    }
  }, [evaluationsState.data])

  const activityFeed = useMemo(() => {
    const events = evaluationsState.data.flatMap((item) => {
      const base = [
        { time: item.createdAt, title: 'Evaluation created', detail: `${item.name} was queued for execution.` },
        { time: item.updatedAt, title: 'Status update', detail: `${item.status} — ${item.progress.currentStage}.` }
      ]

      if (item.progress.logs.length > 0) {
        return [
          ...base,
          ...item.progress.logs.slice(-5).map((log, index) => ({ time: item.updatedAt, title: `${index === item.progress.logs.length - 1 ? 'Latest log' : 'Activity'} `, detail: log }))
        ]
      }

      return base
    })

    return events.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 8)
  }, [evaluationsState.data])

  const updateEvaluationInState = (updated: Evaluation) => {
    setEvaluationsState((current) => ({
      ...current,
      data: current.data.map((item) => (item.id === updated.id ? updated : item))
    }))
    if (activeEvaluation?.id === updated.id || selectedEvaluationId === updated.id) {
      setActiveEvaluation(updated)
    }
  }

  const handleDraftChange = (changes: Partial<EvaluationCreateInput>) => {
    setDraft((current) => ({ ...current, ...changes }))
  }

  const handleTogglePillar = (pillar: AssurancePillar) => {
    setDraft((current) => {
      const hasPillar = current.pillars.includes(pillar)
      return {
        ...current,
        pillars: hasPillar ? current.pillars.filter((item) => item !== pillar) : [...current.pillars, pillar]
      }
    })
  }

  const handleToggleSuite = (suite: string) => {
    setDraft((current) => {
      const selectedSuites = current.testSuites ?? []
      const hasSuite = selectedSuites.includes(suite)
      return {
        ...current,
        testSuites: hasSuite ? selectedSuites.filter((item) => item !== suite) : [...selectedSuites, suite]
      }
    })
  }

  const handleRuntimeOptionChange = (field: keyof EvaluationRuntimeOptions, value: string | number | boolean) => {
    setDraft((current) => ({
      ...current,
      runtimeOptions: {
        timeoutMinutes: current.runtimeOptions?.timeoutMinutes ?? 20,
        maxConcurrency: current.runtimeOptions?.maxConcurrency ?? 3,
        includeReasoningTrace: current.runtimeOptions?.includeReasoningTrace ?? true,
        captureEvidence: current.runtimeOptions?.captureEvidence ?? true,
        notifyOnCompletion: current.runtimeOptions?.notifyOnCompletion ?? true,
        [field]: value
      }
    }))
  }

  const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms))

  const handleSubmit = async () => {
    setSubmissionError(null)
    setStep('progress')
    setProgress(8)
    setIsLaunching(true)

    const controller = new AbortController()

    try {
      const created = await createEvaluation(draft, controller.signal)
      setActiveEvaluation(created)
      setSelectedEvaluationId(created.id)
      setEvaluationsState((current) => ({ data: [created, ...current.data], loading: false, error: null }))

      const started = await startEvaluation(created.id, controller.signal)
      setActiveEvaluation(started)
      updateEvaluationInState(started)
      setProgress(started.progress.percentage)
      setStep('progress')

      showNotification({
        title: 'Evaluation started',
        message: `${started.name} has been queued and is running in the assurance engine.`,
        type: 'success'
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to create evaluation.'
      setProgress(0)
      setSubmissionError(message)
      showNotification({
        title: 'Evaluation launch failed',
        message,
        type: 'error'
      })
      setStep('summary')
    } finally {
      setIsLaunching(false)
      controller.abort()
    }
  }

  const resetWizard = () => {
    setDraft(buildDraftFromPrefill((location.state as { prefill?: PrefillState } | null)?.prefill))
    setStep('configuration')
    setActiveEvaluation(null)
    setProgress(0)
    setSubmissionError(null)
  }

  const openDetails = async (evaluationId: string, mode: 'details' | 'assurance' | 'evidence' = 'details') => {
    const details = await getEvaluationById(evaluationId)
    if (!details) {
      return
    }

    setSelectedEvaluationId(details.id)
    setActiveEvaluation(details)
    setDrawerMode(mode)
    setDrawerOpen(true)
  }

  const closeDrawer = () => {
    setDrawerOpen(false)
    setDrawerMode('details')
  }

  const handleAction = async (action: 'start' | 'pause' | 'resume' | 'cancel' | 'retry' | 'viewEvidence' | 'viewAssurance' | 'generateReport', evaluationId: string) => {
    try {
      let updated: Evaluation | null = null
      switch (action) {
        case 'start':
          updated = await startEvaluation(evaluationId)
          break
        case 'pause':
          updated = await pauseEvaluation(evaluationId)
          break
        case 'resume':
          updated = await resumeEvaluation(evaluationId)
          break
        case 'cancel':
          updated = await cancelEvaluation(evaluationId)
          break
        case 'retry':
          updated = await retryEvaluation(evaluationId)
          break
        case 'viewEvidence':
          await openDetails(evaluationId, 'evidence')
          return
        case 'viewAssurance':
          await openDetails(evaluationId, 'assurance')
          return
        case 'generateReport':
          navigate('/reports', { state: { evaluationId } })
          return
      }

      if (updated) {
        updateEvaluationInState(updated)
        setActiveEvaluation(updated)
        setSelectedEvaluationId(updated.id)
        showNotification({
          title: `Evaluation ${updated.status.toLowerCase()}`,
          message: `${updated.name} is now ${updated.status}.`,
          type: updated.status === 'Running' ? 'success' : updated.status === 'Failed' ? 'error' : 'warning'
        })
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to update evaluation.'
      setSubmissionError(message)
      showNotification({
        title: 'Evaluation update failed',
        message,
        type: 'error'
      })
    }
  }

  return (
    <main className="page-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">Evaluation engine</p>
          <h1>Assess AI systems with structured assurance reviews</h1>
        </div>
      </div>

      <section className="card">
        <div className="card-title">Evaluation summary</div>
        <div className="details-grid">
          {[
            { label: 'Total Evaluations', value: summary.totalEvaluations },
            { label: 'Running Evaluations', value: summary.runningEvaluations },
            { label: 'Completed Evaluations', value: summary.completedEvaluations },
            { label: 'Failed Evaluations', value: summary.failedEvaluations },
            { label: 'Average Assurance Score', value: `${summary.averageAssuranceScore}/100` },
            { label: 'Average Evaluation Time', value: `${summary.averageDurationMinutes}m` }
          ].map((item) => (
            <div key={item.label} className="rounded-[1.25rem] border border-[rgba(148,163,184,0.16)] bg-slate-950/80 p-4">
              <div className="text-sm uppercase tracking-[0.22em] text-slate-400">{item.label}</div>
              <div className="mt-2 text-2xl font-semibold text-white">{item.value}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <div className="card-title">Live evaluation activity</div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[1.25rem] border border-[rgba(148,163,184,0.16)] bg-slate-950/80 p-4">
            <div className="text-sm uppercase tracking-[0.22em] text-slate-400">Current operational status</div>
            <div className="mt-3 flex items-center justify-between gap-2">
              <div>
                <div className="text-lg font-semibold text-white">{selectedEvaluation?.status ?? 'Queued'}</div>
                <div className="text-sm text-slate-300">{selectedEvaluation?.progress.currentStage ?? 'Queued'}</div>
              </div>
              <StatusBadge status={getStatusTone(selectedEvaluation?.status ?? EvaluationStatus.Queued)}>{selectedEvaluation?.status ?? EvaluationStatus.Queued}</StatusBadge>
            </div>
            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-400" style={{ width: `${selectedEvaluation?.progress.percentage ?? 0}%` }} />
            </div>
            <div className="mt-2 text-sm text-slate-300">{selectedEvaluation?.progress.percentage ?? 0}% complete</div>
          </div>

          <div className="rounded-[1.25rem] border border-[rgba(148,163,184,0.16)] bg-slate-950/80 p-4">
            <div className="text-sm uppercase tracking-[0.22em] text-slate-400">Activity feed</div>
            <div className="mt-3 space-y-2">
              {activityFeed.length === 0 && <div className="text-sm text-slate-300">No live events yet.</div>}
              {activityFeed.map((event, index) => (
                <div key={`${event.title}-${index}`} className="rounded-xl border border-slate-800 bg-slate-900/80 p-2">
                  <div className="text-sm font-medium text-white">{event.title}</div>
                  <div className="text-xs text-slate-400">{new Date(event.time).toLocaleString()}</div>
                  <div className="text-xs text-slate-300">{event.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="card">
        <div className="card-title">Evaluation queue</div>
        {evaluationsState.loading && <div className="status-message">Loading evaluations…</div>}
        {!evaluationsState.loading && evaluationsState.error && <div className="status-message error">{evaluationsState.error}</div>}
        {!evaluationsState.loading && !evaluationsState.error && evaluationsState.data.length === 0 && <div className="status-message">No evaluations yet. Launch one to seed the engine.</div>}
        {!evaluationsState.loading && !evaluationsState.error && evaluationsState.data.length > 0 && (
          <Table>
            <TableHeader>
              <tr>
                <TableHeaderCell>Evaluation ID</TableHeaderCell>
                <TableHeaderCell>Target AI System</TableHeaderCell>
                <TableHeaderCell>Model</TableHeaderCell>
                <TableHeaderCell>Test Suite</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Progress</TableHeaderCell>
                <TableHeaderCell>Started</TableHeaderCell>
                <TableHeaderCell>Duration</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </tr>
            </TableHeader>
            <tbody>
              {evaluationsState.data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <button className="text-left text-primary" type="button" onClick={() => { void openDetails(item.id, 'details') }}>
                      {item.id}
                    </button>
                  </TableCell>
                  <TableCell>{item.aiSystemName}</TableCell>
                  <TableCell>{item.model}</TableCell>
                  <TableCell>{item.testSuites.join(', ')}</TableCell>
                  <TableCell>
                    <StatusBadge status={getStatusTone(item.status)}>{item.status}</StatusBadge>
                  </TableCell>
                  <TableCell>{item.progress.percentage}%</TableCell>
                  <TableCell>{item.startedAt ? new Date(item.startedAt).toLocaleDateString() : 'Pending'}</TableCell>
                  <TableCell>{item.durationMinutes > 0 ? `${item.durationMinutes}m` : '—'}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <button className="btn-secondary" type="button" onClick={() => { void handleAction('viewEvidence', item.id) }}>
                        Evidence
                      </button>
                      <button className="btn-secondary" type="button" onClick={() => { void handleAction('viewAssurance', item.id) }}>
                        Assurance
                      </button>
                      <button className="btn-primary" type="button" onClick={() => { void handleAction('start', item.id) }}>
                        Start
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        )}
      </section>

      <section className="card">
        <div className="wizard-stepper">
          <div className={`wizard-step${step === 'configuration' ? ' active' : ''}`}>1. Configure</div>
          <div className={`wizard-step${step === 'summary' ? ' active' : ''}`}>2. Review</div>
          <div className={`wizard-step${step === 'progress' || step === 'results' ? ' active' : ''}`}>3. Run</div>
        </div>

        {step === 'configuration' && (
          <>
            <EvaluationConfiguration
              draft={draft}
              onChange={handleDraftChange}
              onTogglePillar={handleTogglePillar}
              onToggleSuite={handleToggleSuite}
              onChangeRuntimeOption={handleRuntimeOptionChange}
              pillarOptions={pillarOptions}
            />
            <div className="button-row">
              <button type="button" className="btn-primary" onClick={() => setStep('summary')}>
                Review evaluation
              </button>
            </div>
          </>
        )}

        {step === 'summary' && (
          <>
            <EvaluationSummary draft={draft} />
            {submissionError && <div className="status-message error">{submissionError}</div>}
            <div className="button-row">
              <button type="button" className="btn-secondary" onClick={() => setStep('configuration')}>
                Edit configuration
              </button>
              <button type="button" className="btn-primary" onClick={() => { void handleSubmit() }} disabled={isLaunching}>
                {isLaunching ? 'Launching…' : 'Launch evaluation'}
              </button>
            </div>
          </>
        )}

        {step === 'progress' && (
          <EvaluationProgress
            progress={progress}
            status={activeEvaluation?.progress.currentStage ?? 'Preparing evaluation run'}
            lifecycle={activeEvaluation?.lifecycle ?? buildLifecycleState(activeEvaluation?.status ?? EvaluationStatus.Queued, activeEvaluation?.updatedAt ?? new Date().toISOString(), activeEvaluation?.createdAt ?? null)}
          />
        )}

        {step === 'results' && activeEvaluation && (
          <>
            <EvaluationResults evaluation={activeEvaluation} />
            <div className="button-row">
              <button type="button" className="btn-secondary" onClick={resetWizard}>
                Create another evaluation
              </button>
            </div>
          </>
        )}
      </section>

      <Drawer open={drawerOpen} onClose={closeDrawer} title={selectedEvaluation?.name ?? 'Evaluation details'}>
        {selectedEvaluation ? (
          <div className="space-y-4">
            <div className="button-row">
              <button type="button" className={`btn-secondary${drawerMode === 'details' ? ' ring-1 ring-primary/30' : ''}`} onClick={() => setDrawerMode('details')}>
                Details
              </button>
              <button type="button" className={`btn-secondary${drawerMode === 'assurance' ? ' ring-1 ring-primary/30' : ''}`} onClick={() => setDrawerMode('assurance')}>
                Assurance
              </button>
              <button type="button" className={`btn-secondary${drawerMode === 'evidence' ? ' ring-1 ring-primary/30' : ''}`} onClick={() => setDrawerMode('evidence')}>
                Evidence
              </button>
            </div>

            {drawerMode === 'details' && (
              <div className="details-grid">
                <div className="full-width">
                  <p className="detail-label">Current stage</p>
                  <h2 className="system-name">{selectedEvaluation.progress.currentStage}</h2>
                  <p className="system-meta">{selectedEvaluation.summary}</p>
                </div>
                <div>
                  <p className="detail-label">Status</p>
                  <p>{selectedEvaluation.status}</p>
                </div>
                <div>
                  <p className="detail-label">Progress</p>
                  <p>{selectedEvaluation.progress.percentage}%</p>
                </div>
                <div>
                  <p className="detail-label">Started</p>
                  <p>{selectedEvaluation.startedAt ? new Date(selectedEvaluation.startedAt).toLocaleString() : 'Pending'}</p>
                </div>
                <div>
                  <p className="detail-label">Duration</p>
                  <p>{selectedEvaluation.durationMinutes > 0 ? `${selectedEvaluation.durationMinutes}m` : '—'}</p>
                </div>
                <div className="full-width">
                  <p className="detail-label">Active tests</p>
                  <div className="pillar-list">
                    {selectedEvaluation.progress.activeTests.length > 0 ? selectedEvaluation.progress.activeTests.map((test) => <span key={test} className="pillar-chip active">{test}</span>) : <span className="system-meta">No active tests yet.</span>}
                  </div>
                </div>
                <div className="full-width">
                  <p className="detail-label">Logs</p>
                  <div className="finding-list">
                    {selectedEvaluation.progress.logs.map((log) => (
                      <div key={log} className="card" style={{ marginBottom: '0.6rem' }}>
                        <div className="system-meta">{log}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="full-width">
                  <p className="detail-label">Actions</p>
                  <div className="button-row">
                    <button className="btn-primary" type="button" onClick={() => { void handleAction('start', selectedEvaluation.id) }}>Start</button>
                    <button className="btn-secondary" type="button" onClick={() => { void handleAction('pause', selectedEvaluation.id) }}>Pause</button>
                    <button className="btn-secondary" type="button" onClick={() => { void handleAction('resume', selectedEvaluation.id) }}>Resume</button>
                    <button className="btn-secondary" type="button" onClick={() => { void handleAction('cancel', selectedEvaluation.id) }}>Cancel</button>
                    <button className="btn-secondary" type="button" onClick={() => { void handleAction('retry', selectedEvaluation.id) }}>Retry</button>
                    <button className="btn-secondary" type="button" onClick={() => { void handleAction('generateReport', selectedEvaluation.id) }}>Generate Report</button>
                  </div>
                </div>
              </div>
            )}

            {drawerMode === 'assurance' && <AssuranceDashboard evaluationId={selectedEvaluation.id} />}
            {drawerMode === 'evidence' && <EvidenceViewer evidence={evidence} />}
          </div>
        ) : null}
      </Drawer>
    </main>
  )
}
