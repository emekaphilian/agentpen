import { useEffect, useState } from 'react'
import { createEvaluation, getEmptyEvaluationState, getEvaluations } from '../../services/api/evaluations'
import type { AssurancePillar, Evaluation, EvaluationCreateInput } from '../../types'
import { EvaluationConfiguration } from './EvaluationConfiguration'
import { EvaluationProgress } from './EvaluationProgress'
import { EvaluationResults } from './EvaluationResults'
import { EvaluationSummary } from './EvaluationSummary'

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

export function EvaluationWizard() {
  const [draft, setDraft] = useState<EvaluationCreateInput>(defaultDraft)
  const [step, setStep] = useState<'configuration' | 'summary' | 'progress' | 'results'>('configuration')
  const [evaluationsState, setEvaluationsState] = useState(() => getEmptyEvaluationState())
  const [activeEvaluation, setActiveEvaluation] = useState<Evaluation | null>(null)
  const [progress, setProgress] = useState(0)
  const [submissionError, setSubmissionError] = useState<string | null>(null)

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

  const handleSubmit = async () => {
    setSubmissionError(null)
    setStep('progress')
    setProgress(12)

    const controller = new AbortController()

    try {
      const created = await createEvaluation(draft, controller.signal)
      setProgress(100)
      setActiveEvaluation(created)
      setEvaluationsState((current) => ({ data: [created, ...current.data], loading: false, error: null }))
      setStep('results')
    } catch (error) {
      setProgress(0)
      setSubmissionError(error instanceof Error ? error.message : 'Unable to create evaluation.')
      setStep('summary')
    } finally {
      controller.abort()
    }
  }

  const resetWizard = () => {
    setDraft(defaultDraft)
    setStep('configuration')
    setActiveEvaluation(null)
    setProgress(0)
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
        <div className="wizard-stepper">
          <div className={`wizard-step${step === 'configuration' ? ' active' : ''}`}>1. Configure</div>
          <div className={`wizard-step${step === 'summary' ? ' active' : ''}`}>2. Review</div>
          <div className={`wizard-step${step === 'progress' || step === 'results' ? ' active' : ''}`}>3. Run</div>
        </div>

        {step === 'configuration' && (
          <>
            <EvaluationConfiguration draft={draft} onChange={handleDraftChange} onTogglePillar={handleTogglePillar} pillarOptions={pillarOptions} />
            <div className="button-row">
              <button type="button" className="button" onClick={() => setStep('summary')}>
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
              <button type="button" className="button button-secondary" onClick={() => setStep('configuration')}>
                Edit configuration
              </button>
              <button type="button" className="button" onClick={handleSubmit}>
                Launch evaluation
              </button>
            </div>
          </>
        )}

        {step === 'progress' && <EvaluationProgress progress={progress} status="Preparing evaluation run" />}

        {step === 'results' && activeEvaluation && (
          <>
            <EvaluationResults evaluation={activeEvaluation} />
            <div className="button-row">
              <button type="button" className="button button-secondary" onClick={resetWizard}>
                Create another evaluation
              </button>
            </div>
          </>
        )}
      </section>

      <section className="card">
        <div className="card-title">Recent evaluations</div>
        {evaluationsState.loading && <div className="status-message">Loading evaluations…</div>}
        {!evaluationsState.loading && evaluationsState.error && <div className="status-message error">{evaluationsState.error}</div>}
        {!evaluationsState.loading && !evaluationsState.error && evaluationsState.data.length === 0 && <div className="status-message">No evaluations yet. Launch one to seed the engine.</div>}
        {!evaluationsState.loading && !evaluationsState.error && evaluationsState.data.length > 0 && (
          <div className="finding-list">
            {evaluationsState.data.map((item) => (
              <div key={item.id} className="card" style={{ marginBottom: '0.75rem' }}>
                <div className="system-name">{item.name}</div>
                <div className="system-meta">{item.summary}</div>
                <div className="system-meta">Status: {item.status} · {item.deploymentContext}</div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
