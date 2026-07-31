import { useEffect, useMemo, useState } from 'react'
import { createSystem, deleteSystem, getSystems, updateSystem } from '../../services/api/registry'
import type { AISystem, SystemStatus } from '../../types'
import SystemCard from './SystemCard'
import SystemForm from './SystemForm'
import EmptyState from './EmptyState'

export default function SystemsPage() {
  const [systems, setSystems] = useState<AISystem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<SystemStatus | 'all'>('all')
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    void loadSystems()
  }, [])

  const loadSystems = async () => {
    setIsLoading(true)
    const data = await getSystems()
    setSystems(data)
    setIsLoading(false)
  }

  const visibleSystems = useMemo(() => {
    return systems.filter((system) => {
      const matchesSearch = `${system.name} ${system.owner} ${system.description}`.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = statusFilter === 'all' || system.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [systems, search, statusFilter])

  const handleCreate = async (payload: Omit<AISystem, 'id' | 'createdAt' | 'updatedAt'>) => {
    await createSystem(payload)
    await loadSystems()
    setIsCreating(false)
  }

  const handleEdit = async (payload: Omit<AISystem, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingId) return
    await updateSystem(editingId, payload)
    await loadSystems()
    setEditingId(null)
  }

  const handleArchive = async (systemId: string) => {
    await updateSystem(systemId, { status: 'archived' })
    await loadSystems()
  }

  const currentSystem = systems.find((system) => system.id === editingId) || null

  return (
    <main className="page-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">Systems</p>
          <h1>AI System Registry</h1>
        </div>
      </div>

      <section className="card" style={{ marginBottom: '1rem' }}>
        <div className="card-title">Registry controls</div>
        <div className="form-grid fg-3" style={{ marginBottom: '12px' }}>
          <div className="form-group">
            <label>Search</label>
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name or owner" />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as SystemStatus | 'all')}>
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="maintenance">Maintenance</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div className="form-group">
            <label>&nbsp;</label>
            <button className="btn-primary" type="button" onClick={() => { setIsCreating((value) => !value); setEditingId(null) }}>
              {isCreating ? 'Hide form' : 'Register system'}
            </button>
          </div>
        </div>
      </section>

      {isCreating && <SystemForm onSubmit={handleCreate} onCancel={() => setIsCreating(false)} />}

      {editingId && currentSystem && <SystemForm system={currentSystem} onSubmit={handleEdit} onCancel={() => setEditingId(null)} />}

      <section className="card">
        {isLoading && <div className="status-message">Loading systems…</div>}
        {!isLoading && visibleSystems.length === 0 && <EmptyState />}
        {!isLoading && visibleSystems.length > 0 && (
          <div>
            {visibleSystems.map((system) => (
              <SystemCard
                key={system.id}
                system={system}
                onArchive={handleArchive}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
