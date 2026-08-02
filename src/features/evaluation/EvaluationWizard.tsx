import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Drawer } from '../../components/ui/Drawer'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { Table, TableCell, TableHeader, TableHeaderCell, TableRow } from '../../components/ui/Table'
import { createEvaluation, getEmptyEvaluationState, getEvaluationById, getEvaluationProgress, getEvaluations, pauseEvaluation, resumeEvaluation, cancelEvaluation, retryEvaluation, startEvaluation } from '../../services/api/evaluations'
import { getMockEvidence } from '../../services/api/evidence'
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
    case 'Completed':
      return 'healthy'
    case 'Running':
      return 'at-risk'
    case 'Queued':
    case 'Paused':
      return 'warning'
    case 'Failed':
      return 'warning'
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
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [drawerMode, setDrawerMode] = useState<'details' | 'assurance' | 'evidence'>('details')
  const [evidence, setEvidence] = useState<Evidence[]>([])

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

  const selectedEvaluation = useMemo(() => {
    if (selectedEvaluationId) {
      return evaluationsState.data.find((item) => item.id === selectedEvaluationId) ?? activeEvaluation
    }
    return activeEvaluation
  }, [activeEvaluation, evaluationsState.data, selectedEvaluationId])

  const summary = useMemo(() => {
    const total = evaluationsState.data.length
    const running = evaluationsState.data.filter((item) => item.status === 'Running').length
    const completed = evaluationsState.data.filter((item) => item.status === 'Completed').length
    const failed = evaluationsState.data.filter((item) => item.status === 'Failed').length
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

      for (let index = 0; index < 4; index += 1) {
        await wait(800)
        const updated = await getEvaluationProgress(started.id, controller.signal)
        if (updated) {
          setActiveEvaluation(updated)
          updateEvaluationInState(updated)
          setProgress(updated.progress.percentage)
        }
      }

      const completed = await getEvaluationProgress(started.id, controller.signal)
      if (completed) {
        setActiveEvaluation(completed)
        updateEvaluationInState(completed)
        setProgress(completed.progress.percentage)
      }
      setStep('results')
    } catch (error) {
      setProgress(0)
      setSubmissionError(error instanceof Error ? error.message : 'Unable to create evaluation.')
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
      }
    } catch (error) {
      setSubmissionError(error instanceof Error ? error.message : 'Unable to update evaluation.')
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

        {step === 'progress' && <EvaluationProgress progress={progress} status={activeEvaluation?.progress.currentStage ?? 'Preparing evaluation run'} />}

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
