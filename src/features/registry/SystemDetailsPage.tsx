import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchSystemDetails } from '../../services/api/systems'
import type { SystemDetails } from '../../types'

export default function SystemDetailsPage() {
  const { systemId } = useParams()
  const { data, isLoading, error } = useQuery<SystemDetails>({
    queryKey: ['system', systemId],
    queryFn: () => fetchSystemDetails(systemId!),
    enabled: Boolean(systemId)
  })

  return (
    <main className="page-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">System details</p>
          <h1>{data?.name ?? 'System details'}</h1>
        </div>
        <Link to="/systems" className="button button-secondary">
          Back to systems
        </Link>
      </div>

      <section className="card">
        {isLoading && <div className="status-message">Loading system…</div>}
        {error && <div className="status-message error">Error loading system details.</div>}
        {!isLoading && !error && data && (
          <div className="details-grid">
            <div>
              <p className="detail-label">System ID</p>
              <p>{data.id}</p>
            </div>
            <div>
              <p className="detail-label">Target</p>
              <p>{data.target_url}</p>
            </div>
            <div>
              <p className="detail-label">Status</p>
              <p>{data.status}</p>
            </div>
            <div>
              <p className="detail-label">Risk score</p>
              <p>{data.risk_score}%</p>
            </div>
            <div className="full-width">
              <p className="detail-label">Findings</p>
              <div className="finding-list">
                {data.findings.map((finding) => (
                  <article key={finding.id} className="finding-card">
                    <h2>{finding.title}</h2>
                    <p>{finding.description}</p>
                    <p className="finding-meta">Severity: {finding.severity}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}
