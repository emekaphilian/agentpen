import { Link } from 'react-router-dom'
import type { AISystem } from '../../types'

interface SystemCardProps {
  system: AISystem
  onArchive: (systemId: string) => void
}

export default function SystemCard({ system, onArchive }: SystemCardProps) {
  return (
    <div className="card" style={{ marginBottom: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>{system.name}</div>
          <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '4px' }}>{system.owner}</div>
          <div style={{ fontSize: '12px', color: 'var(--muted)' }}>{system.targetUrl}</div>
        </div>
        <div style={{ textAlign: 'right', minWidth: '120px' }}>
          <div className="badge badge-accent" style={{ marginBottom: '6px' }}>{system.status}</div>
          <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '6px' }}>{system.riskLevel} risk</div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <Link to={`/systems/${system.id}`} className="btn-ghost btn-sm">
              View
            </Link>
            <button className="btn-ghost btn-sm" type="button" onClick={() => onArchive(system.id)}>
              Archive
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
