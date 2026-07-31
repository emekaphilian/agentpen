import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getSystemById } from '../../services/api/registry'
import type { AISystem } from '../../types'

export default function SystemDetailsPage() {
  const { systemId } = useParams()
  const [system, setSystem] = useState<AISystem | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!systemId) {
      setIsLoading(false)
      return
    }

    const loadSystem = async () => {
      setIsLoading(true)
      const data = await getSystemById(systemId)
      setSystem(data ?? null)
      setIsLoading(false)
    }

    void loadSystem()
  }, [systemId])

  return (
    <main className="page-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">System details</p>
          <h1>{system?.name ?? 'System details'}</h1>
        </div>
        <Link to="/systems" className="button button-secondary">
          Back to systems
        </Link>
      </div>

      <section className="card">
        {isLoading && <div className="status-message">Loading system…</div>}
        {!isLoading && !system && <div className="status-message error">System not found.</div>}
        {!isLoading && system && (
          <div className="details-grid">
            <div>
              <p className="detail-label">System ID</p>
              <p>{system.id}</p>
            </div>
            <div>
              <p className="detail-label">Owner</p>
              <p>{system.owner}</p>
            </div>
            <div>
              <p className="detail-label">Status</p>
              <p>{system.status}</p>
            </div>
            <div>
              <p className="detail-label">Deployment</p>
              <p>{system.deploymentType}</p>
            </div>
            <div>
              <p className="detail-label">Target</p>
              <p>{system.targetUrl}</p>
            </div>
            <div>
              <p className="detail-label">Risk level</p>
              <p>{system.riskLevel}</p>
            </div>
            <div className="full-width">
              <p className="detail-label">Description</p>
              <p>{system.description}</p>
            </div>
            <div className="full-width">
              <p className="detail-label">Tags</p>
              <div>{system.tags.join(', ')}</div>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}
