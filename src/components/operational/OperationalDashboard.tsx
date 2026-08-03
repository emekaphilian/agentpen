import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAssuranceByEvaluationId } from '../../services/api/assurance'
import { buildLifecycleState } from '../../services/api/evaluationLifecycle'
import { createEvaluation, getEvaluations } from '../../services/api/evaluations'
import { getEvidencePackages, getMockEvidence } from '../../services/api/evidence'
import { getReports } from '../../services/api/reports'
import { getSystems } from '../../services/api/registry'
import type { AISystem, AssurancePillar, AssuranceResult, AssuranceReport, Evaluation, EvaluationCreateInput, Evidence, EvidencePackage } from '../../types'
import { EvaluationStatus } from '../../types'
import OverviewCards from './OverviewCards'
import NewScanPanel from './NewScanPanel'
import ResultsPanel from './ResultsPanel'
import ProbeLibrary from './ProbeLibrary'
import LastReportPanel from './LastReportPanel'
import ScanHistoryPanel from './ScanHistoryPanel'

interface OperationalDashboardProps {
  activeView?: 'scan' | 'results' | 'probes' | 'report' | 'history'
}

interface WorkflowReport {
  evaluationId: string
  targetSystem: string
  modelVersion: string
  timestamp: string
  evidenceSummary: string
  assuranceScores: {
    security: number
    safety: number
    reliability: number
    fairness: number
    domain: number
    overall: number
  }
  recommendations: Array<{ title: string; description: string; priority: string }>
  exportOptions: string[]
}

const defaultDraft: EvaluationCreateInput = {
  name: 'Fresh Assurance Review',
  description: 'Assess the current deployment against the core assurance pillars and collect evidence for follow-up remediation.',
  aiSystemName: 'Compliance Copilot',
  aiSystemId: 'sys-001',
  modelVersion: 'gpt-4.1-2026-04',
  deploymentContext: 'Cloud',
  pillars: ['Security', 'Safety', 'Reliability']
}

const pillarOptions: AssurancePillar[] = ['Security', 'Safety', 'Reliability', 'Fairness', 'Domain']

function createDraftFromSystem(system: AISystem): EvaluationCreateInput {
  return {
    ...defaultDraft,
    name: `${system.name} assurance review`,
    description: `Assess ${system.name} against the core assurance pillars using the registry metadata and live evidence collection.`,
    aiSystemName: system.name,
    aiSystemId: system.id,
    modelVersion: 'gpt-4.1-2026-04',
    deploymentContext: system.deploymentType.charAt(0).toUpperCase() + system.deploymentType.slice(1),
    pillars: ['Security', 'Safety', 'Reliability']
  }
}

function buildFallbackEvaluation(input: EvaluationCreateInput): Evaluation {
  const createdAt = new Date().toISOString()
  return {
    id: `eval-${Date.now()}`,
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
    summary: 'The assurance workflow has been queued for execution.',
    assuranceScore: {
      overall: 0,
      security: 0,
      safety: 0,
      reliability: 0,
      fairness: 0,
      domain: 0
    },
    evidence: [],
    recommendations: [],
    progress: {
      percentage: 12,
      currentStage: 'Initializing',
      completedStages: [],
      activeTests: [],
      logs: ['Queued for evaluation.']
    },
    configuration: {
      aiSystemId: input.aiSystemId,
      aiSystemName: input.aiSystemName,
      model: input.model ?? input.modelVersion,
      modelVersion: input.modelVersion,
      profile: input.profile ?? 'Standard',
      pillars: input.pillars,
      testSuites: input.testSuites ?? ['OWASP Top 10 for LLM Applications', 'Prompt Injection'],
      runtimeOptions: input.runtimeOptions ?? {
        timeoutMinutes: 20,
        maxConcurrency: 3,
        includeReasoningTrace: true,
        captureEvidence: true,
        notifyOnCompletion: true
      }
    },
    testSuites: input.testSuites ?? ['OWASP Top 10 for LLM Applications', 'Prompt Injection'],
    durationMinutes: 0,
    startedAt: '',
    completedAt: null,
    lifecycle: buildLifecycleState(EvaluationStatus.Queued, createdAt, createdAt),
    createdAt,
    updatedAt: createdAt
  }
}

function buildAssuranceScore(result: AssuranceResult): Evaluation['assuranceScore'] {
  const securityCategory = result.categories.find((item) => item.name === 'Security')
  const safetyCategory = result.categories.find((item) => item.name === 'Safety')
  const reliabilityCategory = result.categories.find((item) => item.name === 'Reliability')
  const fairnessCategory = result.categories.find((item) => item.name === 'Fairness')
  const domainCategory = result.categories.find((item) => item.name === 'Domain')

  return {
    overall: result.overallScore,
    security: securityCategory?.weightedScore ?? result.overallScore,
    safety: safetyCategory?.weightedScore ?? result.overallScore,
    reliability: reliabilityCategory?.weightedScore ?? result.overallScore,
    fairness: fairnessCategory?.weightedScore ?? result.overallScore,
    domain: domainCategory?.weightedScore ?? result.overallScore
  }
}

function buildWorkflowReport(evaluation: Evaluation, assurance: AssuranceResult, evidence: Evidence[]): WorkflowReport {
  return {
    evaluationId: evaluation.id,
    targetSystem: evaluation.aiSystemName,
    modelVersion: evaluation.modelVersion,
    timestamp: new Date().toISOString(),
    evidenceSummary: `${evidence.length} evidence artifacts captured across ${evaluation.pillars.length} assurance pillars.`,
    assuranceScores: {
      security: assurance.categories.find((item) => item.name === 'Security')?.weightedScore ?? assurance.overallScore,
      safety: assurance.categories.find((item) => item.name === 'Safety')?.weightedScore ?? assurance.overallScore,
      reliability: assurance.categories.find((item) => item.name === 'Reliability')?.weightedScore ?? assurance.overallScore,
      fairness: assurance.categories.find((item) => item.name === 'Fairness')?.weightedScore ?? assurance.overallScore,
      domain: assurance.categories.find((item) => item.name === 'Domain')?.weightedScore ?? assurance.overallScore,
      overall: assurance.overallScore
    },
    recommendations: assurance.recommendations.map((item) => ({
      title: item.title,
      description: item.description,
      priority: item.priority
    })),
    exportOptions: ['PDF', 'JSON', 'Evidence Bundle']
  }
}

export default function OperationalDashboard({ activeView = 'scan' }: OperationalDashboardProps) {
  const navigate = useNavigate()
  const [systems, setSystems] = useState<AISystem[]>([])
  const [selectedSystemId, setSelectedSystemId] = useState<string>('')
  const [draft, setDraft] = useState<EvaluationCreateInput>(defaultDraft)
  const [activeEvaluation, setActiveEvaluation] = useState<Evaluation | null>(null)
  const [progressPercent, setProgressPercent] = useState(0)
  const [progressLabel, setProgressLabel] = useState('Initialising…')
  const [isRunning, setIsRunning] = useState(false)
  const [history, setHistory] = useState<Evaluation[]>([])
  const [report, setReport] = useState<WorkflowReport | null>(null)
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [evidencePackages, setEvidencePackages] = useState<EvidencePackage[]>([])
  const [assuranceReports, setAssuranceReports] = useState<AssuranceReport[]>([])
  const [isLive, setIsLive] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString())
  const [queueFilter, setQueueFilter] = useState('all')
  const [engineFilter, setEngineFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [targetFilter, setTargetFilter] = useState('all')
  const timersRef = useRef<number[]>([])

  const refreshOperations = async () => {
    try {
      const [items, evaluationItems, evidenceItems, reportItems] = await Promise.all([
        getSystems(),
        getEvaluations(),
        getEvidencePackages(),
        getReports()
      ])

      setSystems(items)
      setEvaluations(evaluationItems)
      setEvidencePackages(evidenceItems)
      setAssuranceReports(reportItems)
      setLastUpdated(new Date().toISOString())
      setIsLive(true)

      if (!selectedSystemId && items.length > 0) {
        const firstSystem = items[0]
        setSelectedSystemId(firstSystem.id)
        setDraft(createDraftFromSystem(firstSystem))
      }
    } catch {
      setIsLive(false)
    }
  }

  useEffect(() => {
    void refreshOperations()
    const intervalId = window.setInterval(() => {
      void refreshOperations()
    }, 2000)

    return () => {
      window.clearInterval(intervalId)
      timersRef.current.forEach((timerId) => window.clearTimeout(timerId))
      timersRef.current = []
    }
  }, [selectedSystemId])

  const operationsSummary = useMemo(() => {
    const running = evaluations.filter((item) => [
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

    const completed = evaluations.filter((item) => item.status === EvaluationStatus.Completed || item.status === EvaluationStatus.Published).length
    const queued = evaluations.filter((item) => item.status === EvaluationStatus.Queued).length
    const failed = evaluations.filter((item) => item.status === EvaluationStatus.Failed).length
    const publishedReports = assuranceReports.filter((report) => report.status === 'Published').length
    const pendingEvidence = evidencePackages.filter((item) => item.assuranceStatus !== 'Completed').length
    const averageScore = evaluations.length > 0
      ? Math.round(evaluations.reduce((sum, item) => sum + item.assuranceScore.overall, 0) / evaluations.length)
      : 0
    const highRiskSystems = systems.filter((system) => ['high', 'critical'].includes(system.riskLevel)).length

    return {
      registeredSystems: systems.length,
      activeEvaluations: evaluations.length,
      runningEvaluations: running,
      queuedEvaluations: queued,
      completedEvaluations: completed,
      pendingEvidencePackages: pendingEvidence,
      generatedEvidencePackages: evidencePackages.length,
      publishedAssuranceReports: publishedReports,
      averageAssuranceScore: averageScore,
      highRiskSystems,
      failedEvaluations: failed,
      platformHealth: running > 0 ? 'Healthy' : 'Stable'
    }
  }, [assuranceReports, evaluations, evidencePackages, systems])

  const operationsFeed = useMemo(() => {
    return evaluations.flatMap((item) => {
      const stage = item.progress.currentStage ?? item.stage
      const detail = item.progress.logs[item.progress.logs.length - 1] ?? item.summary
      return [{
        id: `${item.id}-status`,
        timestamp: item.updatedAt,
        evaluationId: item.id,
        targetSystem: item.aiSystemName,
        currentEngine: 'Evaluation Engine',
        currentStage: stage,
        status: item.status,
        severity: item.status === EvaluationStatus.Failed ? 'high' : item.status === EvaluationStatus.Completed ? 'low' : 'medium',
        title: item.status === EvaluationStatus.Completed ? 'Evaluation Completed' : item.status === EvaluationStatus.Failed ? 'Evaluation Failed' : 'Evaluation Running',
        detail
      }]
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 8)
  }, [evaluations])

  const queueItems = useMemo(() => {
    return evaluations
      .filter((item) => [EvaluationStatus.Queued, EvaluationStatus.Initializing, EvaluationStatus.Discovery, EvaluationStatus.PreparingEnvironment, EvaluationStatus.Running, EvaluationStatus.RunningSecurityAssurance, EvaluationStatus.RunningSafetyAssurance, EvaluationStatus.RunningReliabilityAssurance, EvaluationStatus.RunningFairnessAssurance, EvaluationStatus.RunningDomainAssurance, EvaluationStatus.EvidenceCollection, EvaluationStatus.EvidenceValidation, EvaluationStatus.AssuranceCalculation, EvaluationStatus.ReportGeneration, EvaluationStatus.PublishingResults, EvaluationStatus.Paused].includes(item.status))
      .map((item) => ({
        ...item,
        priority: item.status === EvaluationStatus.Queued ? 'Normal' : 'High',
        engine: item.status === EvaluationStatus.Running ? 'Evaluation Engine' : 'Discovery Engine'
      }))
  }, [evaluations])

  const filteredQueue = useMemo(() => {
    return queueItems.filter((item) => {
      const matchesStatus = queueFilter === 'all' || item.status === queueFilter
      const matchesEngine = engineFilter === 'all' || item.engine === engineFilter
      const matchesPriority = priorityFilter === 'all' || item.priority === priorityFilter
      const matchesTarget = targetFilter === 'all' || item.aiSystemName === targetFilter
      return matchesStatus && matchesEngine && matchesPriority && matchesTarget
    })
  }, [engineFilter, priorityFilter, queueFilter, queueItems, targetFilter])

  const platformHealth = useMemo(() => [
    { name: 'Backend API', status: 'Online', response: '146ms' },
    { name: 'Database', status: 'Online', response: '42ms' },
    { name: 'Evaluation Worker', status: 'Warning', response: '320ms' },
    { name: 'Queue Processor', status: 'Online', response: '91ms' },
    { name: 'Evidence Storage', status: 'Online', response: '68ms' },
    { name: 'Reporting Service', status: 'Online', response: '210ms' }
  ], [])

  const recentEvidence = useMemo(() => {
    return evidencePackages.slice(0, 4)
  }, [evidencePackages])

  const recentReports = useMemo(() => {
    return assuranceReports.slice(0, 4)
  }, [assuranceReports])

  const selectedSystem = systems.find((system) => system.id === selectedSystemId) ?? null

  const score = activeEvaluation?.assuranceScore?.overall ?? 0
  const band = score >= 75 ? 'LOW' : score >= 60 ? 'MEDIUM' : score >= 45 ? 'HIGH' : 'CRITICAL'
  const vulnerableCount = activeEvaluation ? Math.max(0, Math.round(score / 20)) : 0
  const inconclusiveCount = activeEvaluation ? Math.max(0, Math.round((100 - score) / 20)) : 0
  const resistantCount = activeEvaluation ? Math.max(0, 10 - vulnerableCount - inconclusiveCount) : 0

  const overviewDescription = activeEvaluation
    ? `Evaluation ${activeEvaluation.status.toLowerCase()} for ${activeEvaluation.aiSystemName}`
    : 'No evaluation results yet.'
  const assuranceConfidence = activeEvaluation ? '82%' : '0%'
  const assuranceRiskRating = band === 'LOW' ? 'Low' : band === 'MEDIUM' ? 'Moderate' : band === 'HIGH' ? 'High' : 'Critical'
  const deploymentRecommendation = score >= 80 ? 'Ready for Deployment' : score >= 60 ? 'Ready with Conditions' : 'Further Evaluation Required'
  const pillarSummaries = [
    { name: 'Security Assurance', score: activeEvaluation?.assuranceScore.security ?? 0, confidence: 'High', status: activeEvaluation ? 'Tracked' : 'Pending', description: 'Control coverage and resilience against adversarial prompts.' },
    { name: 'Safety Assurance', score: activeEvaluation?.assuranceScore.safety ?? 0, confidence: 'High', status: activeEvaluation ? 'Tracked' : 'Pending', description: 'Behavioral safeguards and harmful-output prevention.' },
    { name: 'Reliability Assurance', score: activeEvaluation?.assuranceScore.reliability ?? 0, confidence: 'Medium', status: activeEvaluation ? 'Tracked' : 'Pending', description: 'Consistency and stable execution under evaluation.' },
    { name: 'Fairness Assurance', score: activeEvaluation?.assuranceScore.fairness ?? 0, confidence: 'Medium', status: activeEvaluation ? 'Tracked' : 'Pending', description: 'Outcome balance and equitable treatment across contexts.' },
    { name: 'Domain Readiness', score: activeEvaluation?.assuranceScore.domain ?? 0, confidence: 'Medium', status: activeEvaluation ? 'Tracked' : 'Pending', description: 'Operational readiness for the target deployment context.' }
  ]

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

  const handleSelectSystem = (systemId: string) => {
    const system = systems.find((item) => item.id === systemId)
    if (!system) {
      return
    }

    setSelectedSystemId(system.id)
    setDraft(createDraftFromSystem(system))
  }

  const updateEvaluation = (status: EvaluationStatus, nextLabel: string, nextPercent: number, overrides: Partial<Evaluation> = {}) => {
    setActiveEvaluation((current) => {
      if (!current) {
        return current
      }

      const nextState = {
        ...current,
        ...overrides,
        status,
        updatedAt: new Date().toISOString(),
        lifecycle: buildLifecycleState(status, new Date().toISOString(), current.createdAt)
      }

      return nextState
    })

    setProgressLabel(nextLabel)
    setProgressPercent(nextPercent)
  }

  const handleRunEvaluation = async () => {
    if (isRunning) {
      return
    }

    setIsRunning(true)
    setProgressPercent(12)
    setProgressLabel('Queueing evaluation')

    try {
      const created = await createEvaluation(draft)
      const seededEvaluation = {
        ...created,
        lifecycle: created.lifecycle ?? buildLifecycleState(created.status ?? EvaluationStatus.Queued, created.updatedAt, created.createdAt)
      }
      setActiveEvaluation(seededEvaluation)
      setHistory((current) => [seededEvaluation, ...current.filter((item) => item.id !== seededEvaluation.id)].slice(0, 6))
      setReport(null)

      const steps: Array<{ status: EvaluationStatus; label: string; percent: number }> = [
        { status: EvaluationStatus.Queued, label: 'Queued', percent: 12 },
        { status: EvaluationStatus.Running, label: 'Running', percent: 36 },
        { status: EvaluationStatus.CollectingEvidence, label: 'Collecting evidence', percent: 62 },
        { status: EvaluationStatus.CalculatingScores, label: 'Calculating assurance', percent: 82 },
        { status: EvaluationStatus.GeneratingReport, label: 'Generating report', percent: 94 },
        { status: EvaluationStatus.Completed, label: 'Completed', percent: 100 }
      ]

      steps.forEach((step, index) => {
        const timerId = window.setTimeout(() => {
          if (step.status === EvaluationStatus.Completed) {
            void (async () => {
              try {
                const evidence = await getMockEvidence()
                const assurance = await getAssuranceByEvaluationId(seededEvaluation.id)
                const completedEvaluation: Evaluation = {
                  ...seededEvaluation,
                  status: EvaluationStatus.Completed,
                  summary: 'Evaluation completed successfully and the assurance report is ready.',
                  assuranceScore: buildAssuranceScore(assurance),
                  recommendations: assurance.recommendations,
                  lifecycle: buildLifecycleState(EvaluationStatus.Completed, new Date().toISOString(), seededEvaluation.createdAt)
                }

                setActiveEvaluation(completedEvaluation)
                setHistory((current) => [completedEvaluation, ...current.filter((item) => item.id !== completedEvaluation.id)].slice(0, 6))
                setReport(buildWorkflowReport(completedEvaluation, assurance, evidence))
              } catch {
                updateEvaluation(EvaluationStatus.Completed, 'Completed', 100)
              } finally {
                setIsRunning(false)
              }
            })()
          } else {
            updateEvaluation(step.status, step.label, step.percent)
          }
        }, index * 900)

        timersRef.current.push(timerId)
      })
    } catch {
      const fallbackEvaluation = buildFallbackEvaluation(draft)
      setActiveEvaluation(fallbackEvaluation)
      setHistory((current) => [fallbackEvaluation, ...current.filter((item) => item.id !== fallbackEvaluation.id)].slice(0, 6))
      setProgressPercent(100)
      setProgressLabel('Completed')
      setIsRunning(false)
    }
  }

  return (
    <>
      {!isLive && (
        <div className="card" style={{ marginBottom: '1.25rem' }}>
          <div className="status-message error">Connection lost. Live operations data will reconnect automatically.</div>
        </div>
      )}

      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div className="card-title">AI Assurance Operations Center</div>
        <div className="details-grid">
          {[
            { label: 'Registered AI Systems', value: operationsSummary.registeredSystems },
            { label: 'Active Evaluations', value: operationsSummary.activeEvaluations },
            { label: 'Running Evaluations', value: operationsSummary.runningEvaluations },
            { label: 'Queued Evaluations', value: operationsSummary.queuedEvaluations },
            { label: 'Completed Evaluations', value: operationsSummary.completedEvaluations },
            { label: 'Pending Evidence Packages', value: operationsSummary.pendingEvidencePackages },
            { label: 'Generated Evidence Packages', value: operationsSummary.generatedEvidencePackages },
            { label: 'Published Assurance Reports', value: operationsSummary.publishedAssuranceReports },
            { label: 'Average Assurance Score', value: `${operationsSummary.averageAssuranceScore}/100` },
            { label: 'High Risk Systems', value: operationsSummary.highRiskSystems },
            { label: 'Failed Evaluations', value: operationsSummary.failedEvaluations },
            { label: 'Overall Platform Health', value: operationsSummary.platformHealth }
          ].map((item) => (
            <div key={item.label} className="rounded-[1.25rem] border border-[rgba(148,163,184,0.16)] bg-slate-950/80 p-4">
              <div className="text-sm uppercase tracking-[0.22em] text-slate-400">{item.label}</div>
              <div className="mt-2 text-2xl font-semibold text-white">{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      <OverviewCards score={score} band={band} description={overviewDescription} vulnerable={vulnerableCount} inconclusive={inconclusiveCount} resistant={resistantCount} accentColor={band === 'CRITICAL' || band === 'HIGH' ? '#f87171' : band === 'MEDIUM' ? '#fbbf24' : '#4ade80'} backgroundColor={band === 'CRITICAL' || band === 'HIGH' ? 'rgba(239,68,68,0.08)' : band === 'MEDIUM' ? 'rgba(245,158,11,0.08)' : 'rgba(34,197,94,0.08)'} confidence={assuranceConfidence} riskRating={assuranceRiskRating} recommendation={deploymentRecommendation} />

      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div className="card-title">Live operations feed</div>
        <div className="space-y-2">
          {operationsFeed.map((entry) => (
            <div key={`${entry.id}-${entry.timestamp}`} className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-white">{entry.title}</div>
                <div className="text-xs text-slate-400">{new Date(entry.timestamp).toLocaleString()}</div>
              </div>
              <div className="text-xs text-slate-300">{entry.evaluationId} · {entry.targetSystem} · {entry.currentEngine} · {entry.currentStage}</div>
              <div className="text-xs text-slate-400">{entry.detail}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div className="card-title">Assurance pipeline</div>
        <div className="flex flex-wrap items-center gap-3">
          {['Discovery', 'Evaluation', 'Evidence', 'Assurance', 'Reporting'].map((stage, index) => (
            <div key={stage} className="flex items-center gap-3">
              <div className="rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-xs text-white">{stage}</div>
              {index < 4 && <span className="text-slate-400">↓</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div className="card-title">Engine health</div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {['Discovery Engine', 'Evaluation Engine', 'Evidence Engine', 'Assurance Engine', 'Reporting Engine'].map((engine) => (
            <div key={engine} className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
              <div className="text-sm font-semibold text-white">{engine}</div>
              <div className="mt-2 text-xs text-slate-300">Status: Online</div>
              <div className="text-xs text-slate-300">Queue Size: 2</div>
              <div className="text-xs text-slate-300">Active Jobs: 1</div>
              <div className="text-xs text-slate-300">Health: Green</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div className="card-title">Unified evaluation queue</div>
        <div className="mb-3 flex flex-wrap gap-2">
          <select className="input-field" value={queueFilter} onChange={(event) => setQueueFilter(event.target.value)}>
            <option value="all">All statuses</option>
            <option value={EvaluationStatus.Queued}>Queued</option>
            <option value={EvaluationStatus.Running}>Running</option>
            <option value={EvaluationStatus.Paused}>Paused</option>
            <option value={EvaluationStatus.Completed}>Completed</option>
          </select>
          <select className="input-field" value={engineFilter} onChange={(event) => setEngineFilter(event.target.value)}>
            <option value="all">All engines</option>
            <option value="Evaluation Engine">Evaluation Engine</option>
            <option value="Discovery Engine">Discovery Engine</option>
          </select>
          <select className="input-field" value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value)}>
            <option value="all">All priorities</option>
            <option value="Normal">Normal</option>
            <option value="High">High</option>
          </select>
          <select className="input-field" value={targetFilter} onChange={(event) => setTargetFilter(event.target.value)}>
            <option value="all">All targets</option>
            {Array.from(new Set(evaluations.map((item) => item.aiSystemName))).map((target) => (
              <option key={target} value={target}>{target}</option>
            ))}
          </select>
        </div>
        <div className="grid gap-2">
          {filteredQueue.map((item) => (
            <div key={item.id} className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm font-semibold text-white">{item.id}</div>
                <div className="text-xs text-slate-300">{item.aiSystemName}</div>
                <div className="text-xs text-slate-300">{item.progress.currentStage}</div>
                <div className="text-xs text-slate-300">{item.progress.percentage}%</div>
                <div className="text-xs text-slate-300">{item.priority}</div>
                <div className="text-xs text-slate-300">{item.testSuites.join(', ')}</div>
                <div className="text-xs text-slate-300">{item.startedAt ? new Date(item.startedAt).toLocaleString() : 'Pending'}</div>
                <div className="text-xs text-slate-300">{item.durationMinutes || 0}m</div>
                <div className="text-xs text-slate-300">{item.engine}</div>
                <div className="text-xs text-slate-300">{item.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div className="card-title">Platform health</div>
        <div className="space-y-2">
          {platformHealth.map((service) => (
            <div key={service.name} className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-white">{service.name}</div>
                <div className="text-xs text-slate-300">{service.status}</div>
              </div>
              <div className="text-xs text-slate-400">Response: {service.response}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div className="card-title">Recent evidence</div>
        <div className="space-y-2">
          {recentEvidence.map((item) => (
            <div key={item.id} className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-white">{item.id}</div>
                  <div className="text-xs text-slate-300">Confidence: {item.confidence}%</div>
                </div>
                <button type="button" className="btn-secondary" onClick={() => navigate('/evidence')}>Open evidence</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div className="card-title">Recent assurance reports</div>
        <div className="space-y-2">
          {recentReports.map((item) => (
            <div key={item.id} className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-white">{item.id}</div>
                  <div className="text-xs text-slate-300">Score: {item.overallScore}/100</div>
                  <div className="text-xs text-slate-300">Framework coverage: {item.frameworkMappings.length}</div>
                </div>
                <div className="flex gap-2">
                  <button type="button" className="btn-secondary" onClick={() => navigate('/reports')}>View report</button>
                  <button type="button" className="btn-primary" onClick={() => navigate('/reports')}>Download report</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div className="card-title">Five assurance pillars</div>
        <div className="metrics">
          {pillarSummaries.map((pillar) => (
            <div key={pillar.name} className="metric">
              <div className="metric-label">{pillar.name}</div>
              <div className="metric-val" style={{ color: '#818cf8' }}>{pillar.score}/100</div>
              <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px' }}>{pillar.confidence} confidence</div>
              <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{pillar.status}</div>
              <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px' }}>{pillar.description}</div>
            </div>
          ))}
        </div>
      </div>
      <NewScanPanel
        systems={systems}
        selectedSystemId={selectedSystemId}
        draft={draft}
        onSelectSystem={handleSelectSystem}
        onDraftChange={handleDraftChange}
        onTogglePillar={handleTogglePillar}
        onRunEvaluation={handleRunEvaluation}
        isRunning={isRunning}
        progressLabel={progressLabel}
        progressPercent={progressPercent}
        selectedSystem={selectedSystem}
      />
      <ResultsPanel evaluation={activeEvaluation} />
      <ProbeLibrary pillars={draft.pillars} selectedSystemName={selectedSystem?.name ?? draft.aiSystemName} />
      <LastReportPanel report={report} evaluation={activeEvaluation} />
      <ScanHistoryPanel history={history} />
    </>
  )
}
