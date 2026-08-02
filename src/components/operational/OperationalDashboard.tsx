import { useEffect, useRef, useState } from 'react'
import { getAssuranceByEvaluationId } from '../../services/api/assurance'
import { buildLifecycleState } from '../../services/api/evaluationLifecycle'
import { createEvaluation } from '../../services/api/evaluations'
import { getMockEvidence } from '../../services/api/evidence'
import { getSystems } from '../../services/api/registry'
import type { AISystem, AssurancePillar, AssuranceResult, Evaluation, EvaluationCreateInput, Evidence } from '../../types'
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
    deploymentContext: input.deploymentContext,
    pillars: input.pillars,
    status: EvaluationStatus.Queued,
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
  const [systems, setSystems] = useState<AISystem[]>([])
  const [selectedSystemId, setSelectedSystemId] = useState<string>('')
  const [draft, setDraft] = useState<EvaluationCreateInput>(defaultDraft)
  const [activeEvaluation, setActiveEvaluation] = useState<Evaluation | null>(null)
  const [progressPercent, setProgressPercent] = useState(0)
  const [progressLabel, setProgressLabel] = useState('Initialising…')
  const [isRunning, setIsRunning] = useState(false)
  const [history, setHistory] = useState<Evaluation[]>([])
  const [report, setReport] = useState<WorkflowReport | null>(null)
  const timersRef = useRef<number[]>([])

  useEffect(() => {
    const loadSystems = async () => {
      try {
        const items = await getSystems()
        setSystems(items)
        if (!selectedSystemId && items.length > 0) {
          const firstSystem = items[0]
          setSelectedSystemId(firstSystem.id)
          setDraft(createDraftFromSystem(firstSystem))
        }
      } catch {
        setSystems([])
      }
    }

    void loadSystems()
  }, [selectedSystemId])

  useEffect(() => {
    return () => {
      timersRef.current.forEach((timerId) => window.clearTimeout(timerId))
      timersRef.current = []
    }
  }, [])

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
      <OverviewCards score={score} band={band} description={overviewDescription} vulnerable={vulnerableCount} inconclusive={inconclusiveCount} resistant={resistantCount} accentColor={band === 'CRITICAL' || band === 'HIGH' ? '#f87171' : band === 'MEDIUM' ? '#fbbf24' : '#4ade80'} backgroundColor={band === 'CRITICAL' || band === 'HIGH' ? 'rgba(239,68,68,0.08)' : band === 'MEDIUM' ? 'rgba(245,158,11,0.08)' : 'rgba(34,197,94,0.08)'} confidence={assuranceConfidence} riskRating={assuranceRiskRating} recommendation={deploymentRecommendation} />
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
