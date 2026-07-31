import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { fetchSystems, SystemSummary } from '../services/systems'

export default function SystemsPage() {
  const { data = [], isLoading, error } = useQuery<SystemSummary[], Error>({
    queryKey: ['systems'],
    queryFn: fetchSystems,
    initialData: []
  })

  return (
    <main className="page-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">Systems</p>
          <h1>Discovered systems</h1>
        </div>
      </div>

      <section className="card">
        {isLoading && <div className="status-message">Loading systems…</div>}
        {error && <div className="status-message error">Unable to load systems.</div>}
        {!isLoading && !error && data.length === 0 && (
          <div className="status-message">No systems available yet.</div>
        )}

        {!isLoading && !error && data.length > 0 && (
          <div className="grid-list">
            {data.map((system) => (
              <Link key={system.id} to={`/systems/${system.id}`} className="system-card">
                <p className="system-name">{system.name}</p>
                <p className="system-meta">{system.finding_count} findings · {system.risk_score}% risk</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
