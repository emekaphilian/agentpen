import type { AssuranceReport } from '../../types'

interface EvaluationMetadataProps {
  report: AssuranceReport
}

export function EvaluationMetadata({ report }: EvaluationMetadataProps) {
  return (
    <div className="card" style={{ padding: '1.25rem' }}>
      <div className="detail-label">Evaluation metadata</div>
      <div className="details-grid">
        <div>
          <div className="system-meta">Report ID</div>
          <div className="system-name">{report.id}</div>
        </div>
        <div>
          <div className="system-meta">Evaluation ID</div>
          <div className="system-name">{report.metadata.evaluationId}</div>
        </div>
        <div>
          <div className="system-meta">AI system</div>
          <div className="system-name">{report.metadata.aiSystem}</div>
        </div>
        <div>
          <div className="system-meta">Model version</div>
          <div className="system-name">{report.metadata.modelVersion}</div>
        </div>
        <div>
          <div className="system-meta">Deployment context</div>
          <div className="system-name">{report.metadata.deploymentContext}</div>
        </div>
        <div>
          <div className="system-meta">Generated</div>
          <div className="system-name">{new Date(report.metadata.generatedAt).toLocaleString()}</div>
        </div>
      </div>
    </div>
  )
}
