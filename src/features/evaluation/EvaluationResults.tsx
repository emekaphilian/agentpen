import { EvaluationStatus, type Evaluation } from '../../types'
import { useEffect, useState } from 'react'
import { getMockEvidence } from '../../services/api/evidence'
import type { Evidence } from '../../types'
import { AssuranceDashboard } from '../assurance/AssuranceDashboard'
import { EvidenceViewer } from '../evidence/EvidenceViewer'
import { EvaluationCancelled } from './lifecycle/EvaluationCancelled'
import { EvaluationCompleted } from './lifecycle/EvaluationCompleted'
import { EvaluationExecution } from './lifecycle/EvaluationExecution'
import { EvaluationFailed } from './lifecycle/EvaluationFailed'
import { EvaluationQueue } from './lifecycle/EvaluationQueue'
import { EvaluationStatusTimeline } from './lifecycle/EvaluationStatusTimeline'

interface EvaluationResultsProps {
  evaluation: Evaluation
}

export function EvaluationResults({ evaluation }: EvaluationResultsProps) {
  const [evidence, setEvidence] = useState<Evidence[]>([])

  useEffect(() => {
    const loadEvidence = async () => {
      try {
        const items = await getMockEvidence()
        setEvidence(items)
      } catch {
        setEvidence([])
      }
    }

    void loadEvidence()
  }, [evaluation.id])

  const lifecycle = evaluation.lifecycle ?? {
    currentStatus: evaluation.status ?? EvaluationStatus.Draft,
    progress: 0,
    steps: [],
    startedAt: evaluation.createdAt,
    updatedAt: evaluation.updatedAt,
    completedAt: null
  }

  return (
    <div className="details-grid">
      <div className="full-width">
        <p className="detail-label">Result</p>
        <h2 className="system-name">{evaluation.name}</h2>
        <p className="system-meta">{evaluation.summary}</p>
      </div>

      <div>
        <p className="detail-label">Status</p>
        <p className="badge">{lifecycle.currentStatus}</p>
      </div>
      <div>
        <p className="detail-label">Score</p>
        <p>{evaluation.assuranceScore.overall}/100</p>
      </div>
      <div>
        <p className="detail-label">AI system</p>
        <p>{evaluation.aiSystemName}</p>
      </div>
      <div>
        <p className="detail-label">Deployment context</p>
        <p>{evaluation.deploymentContext}</p>
      </div>

      <div className="full-width">
        <p className="detail-label">Pillars</p>
        <div className="pillar-list">
          {evaluation.pillars.map((pillar) => (
            <span key={pillar} className="pillar-chip active">
              {pillar}
            </span>
          ))}
        </div>
      </div>

      <div className="full-width">
        <p className="detail-label">Evaluation lifecycle</p>
        {lifecycle.currentStatus === EvaluationStatus.Completed && <EvaluationCompleted lifecycle={lifecycle} />}
        {lifecycle.currentStatus === EvaluationStatus.Failed && <EvaluationFailed lifecycle={lifecycle} />}
        {lifecycle.currentStatus === EvaluationStatus.Cancelled && <EvaluationCancelled lifecycle={lifecycle} />}
        {(lifecycle.currentStatus === EvaluationStatus.Queued || lifecycle.currentStatus === EvaluationStatus.Initializing) && <EvaluationQueue lifecycle={lifecycle} />}
        {(lifecycle.currentStatus === EvaluationStatus.Running || lifecycle.currentStatus === EvaluationStatus.CollectingEvidence || lifecycle.currentStatus === EvaluationStatus.CalculatingScores || lifecycle.currentStatus === EvaluationStatus.GeneratingReport) && <EvaluationExecution lifecycle={lifecycle} />}
        <EvaluationStatusTimeline lifecycle={lifecycle} />
      </div>

      <div className="full-width">
        <p className="detail-label">Evaluation metadata</p>
        <div className="finding-list">
          <div className="card" style={{ marginBottom: '0.75rem' }}>
            <div className="system-name">Evaluation ID</div>
            <div className="system-meta">{evaluation.id}</div>
          </div>
          <div className="card" style={{ marginBottom: '0.75rem' }}>
            <div className="system-name">AI system</div>
            <div className="system-meta">{evaluation.aiSystemName}</div>
          </div>
          <div className="card" style={{ marginBottom: '0.75rem' }}>
            <div className="system-name">Model version</div>
            <div className="system-meta">{evaluation.modelVersion}</div>
          </div>
          <div className="card" style={{ marginBottom: '0.75rem' }}>
            <div className="system-name">Deployment context</div>
            <div className="system-meta">{evaluation.deploymentContext}</div>
          </div>
          <div className="card" style={{ marginBottom: '0.75rem' }}>
            <div className="system-name">Evaluation date</div>
            <div className="system-meta">{new Date(evaluation.createdAt).toLocaleString()}</div>
          </div>
          <div className="card" style={{ marginBottom: '0.75rem' }}>
            <div className="system-name">Selected test suite</div>
            <div className="system-meta">{evaluation.pillars.join(', ')}</div>
          </div>
        </div>
      </div>

      <div className="full-width">
        <p className="detail-label">Assurance scores</p>
        <AssuranceDashboard evaluationId={evaluation.id} />
      </div>

      <div className="full-width">
        <p className="detail-label">Evidence</p>
        <EvidenceViewer evidence={evidence} />
      </div>

      <div className="full-width">
        <p className="detail-label">Recommendations</p>
        <div className="finding-list">
          {evaluation.recommendations.map((item) => (
            <div key={item.id} className="card" style={{ marginBottom: '0.75rem' }}>
              <div className="system-name">{item.title}</div>
              <div className="system-meta">{item.description}</div>
              <div className="system-meta">Priority: {item.priority}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
