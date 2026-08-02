import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Drawer } from '../../components/ui/Drawer'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { Table, TableCell, TableHeader, TableHeaderCell, TableRow } from '../../components/ui/Table'
import { discoverAssets, getAssetDetails, listDiscoveredAssets, registerAsset } from '../../services/api/discovery'
import type { DiscoveryAsset, DiscoveryStatus, DiscoverySummary } from '../../types'

const defaultSummary: DiscoverySummary = {
  aiSystems: 0,
  models: 0,
  agents: 0,
  apis: 0,
  mcpServers: 0,
  tools: 0,
  memoryStores: 0,
  ragSources: 0
}

const summaryCards = [
  { key: 'aiSystems' as const, label: 'AI Systems', accent: 'bg-primary/12 text-primary border border-primary/20' },
  { key: 'models' as const, label: 'Models', accent: 'bg-info/12 text-info border border-info/20' },
  { key: 'agents' as const, label: 'Agents', accent: 'bg-warning/12 text-warning border border-warning/20' },
  { key: 'apis' as const, label: 'APIs', accent: 'bg-success/12 text-success border border-success/20' },
  { key: 'mcpServers' as const, label: 'MCP Servers', accent: 'bg-critical/12 text-critical border border-critical/20' },
  { key: 'tools' as const, label: 'Tools', accent: 'bg-slate-700/80 text-slate-200 border border-slate-600/50' },
  { key: 'memoryStores' as const, label: 'Memory Stores', accent: 'bg-primary/12 text-primary border border-primary/20' },
  { key: 'ragSources' as const, label: 'RAG Sources', accent: 'bg-warning/12 text-warning border border-warning/20' }
]

function getStatusTone(status: DiscoveryStatus) {
  switch (status) {
    case 'Discovered':
      return 'healthy'
    case 'Registered':
      return 'warning'
    case 'Ready for Evaluation':
      return 'healthy'
    case 'Evaluation Running':
      return 'at-risk'
    case 'Evaluation Complete':
      return 'healthy'
    default:
      return 'offline'
  }
}

export default function DiscoveryPage() {
  const [assets, setAssets] = useState<DiscoveryAsset[]>([])
  const [summary, setSummary] = useState<DiscoverySummary>(defaultSummary)
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null)
  const [activeAsset, setActiveAsset] = useState<DiscoveryAsset | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    void loadDiscoveryData()
  }, [])

  const loadDiscoveryData = async () => {
    setIsLoading(true)
    const payload = await discoverAssets()
    setAssets(payload.assets)
    setSummary(payload.summary)
    setIsLoading(false)
  }

  const visibleAssets = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) {
      return assets
    }

    return assets.filter((asset) => {
      return [asset.name, asset.assetType, asset.provider, asset.version, asset.status]
        .join(' ')
        .toLowerCase()
        .includes(term)
    })
  }, [assets, search])

  const openDetails = async (assetId: string) => {
    const details = await getAssetDetails(assetId)
    setSelectedAssetId(assetId)
    setActiveAsset(details)
  }

  const closeDetails = () => {
    setSelectedAssetId(null)
    setActiveAsset(null)
  }

  const handleRegister = async (asset: DiscoveryAsset) => {
    const updatedAsset = await registerAsset(asset.id)
    setAssets((currentAssets) => currentAssets.map((item) => item.id === updatedAsset.id ? updatedAsset : item))
    setActiveAsset(updatedAsset)
    setSelectedAssetId(updatedAsset.id)
    navigate('/evaluations', {
      state: {
        prefill: {
          id: updatedAsset.id,
          name: updatedAsset.name,
          description: updatedAsset.description,
          version: updatedAsset.version,
          provider: updatedAsset.provider,
          endpoint: updatedAsset.endpoint,
          assetType: updatedAsset.assetType
        }
      }
    })
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    const payload = await discoverAssets()
    setAssets(payload.assets)
    setSummary(payload.summary)
    setIsRefreshing(false)
  }

  return (
    <main className="page-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">Discovery</p>
          <h1>AI discovery engine</h1>
        </div>
        <button className="btn-primary" type="button" onClick={() => { void handleRefresh() }}>
          {isRefreshing ? 'Refreshing…' : 'Refresh discovery'}
        </button>
      </div>

      <section className="card" style={{ marginBottom: '1rem' }}>
        <div className="card-title">Discovery overview</div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <div key={card.key} className={`rounded-[1.25rem] border px-4 py-4 ${card.accent}`}>
              <div className="text-sm uppercase tracking-[0.22em] opacity-80">{card.label}</div>
              <div className="mt-2 text-2xl font-semibold">{summary[card.key]}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <div className="card-title">Discovered assets</div>
        <div className="form-group" style={{ marginBottom: '12px' }}>
          <label>Search assets</label>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, provider, status, or type"
          />
        </div>

        {isLoading ? (
          <div className="status-message">Loading discovered assets…</div>
        ) : visibleAssets.length === 0 ? (
          <div className="status-message">No assets match the current search.</div>
        ) : (
          <Table>
            <TableHeader>
              <tr>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Asset Type</TableHeaderCell>
                <TableHeaderCell>Provider</TableHeaderCell>
                <TableHeaderCell>Version</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Last Seen</TableHeaderCell>
                <TableHeaderCell>Evaluation Ready</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </tr>
            </TableHeader>
            <tbody>
              {visibleAssets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell>
                    <button type="button" className="text-left text-primary" onClick={() => { void openDetails(asset.id) }}>
                      {asset.name}
                    </button>
                  </TableCell>
                  <TableCell>{asset.assetType}</TableCell>
                  <TableCell>{asset.provider}</TableCell>
                  <TableCell>{asset.version}</TableCell>
                  <TableCell>
                    <StatusBadge status={getStatusTone(asset.status)}>{asset.status}</StatusBadge>
                  </TableCell>
                  <TableCell>{asset.lastSeen}</TableCell>
                  <TableCell>{asset.evaluationReady ? 'Yes' : 'No'}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <button className="btn-secondary" type="button" onClick={() => { void openDetails(asset.id) }}>
                        View Details
                      </button>
                      <button className="btn-primary" type="button" onClick={() => { void handleRegister(asset) }}>
                        Register
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        )}
      </section>

      <Drawer open={Boolean(activeAsset)} onClose={closeDetails} title="Discovery asset details">
        {activeAsset ? (
          <div className="space-y-4">
            <div>
              <p className="eyebrow">Asset</p>
              <h2 className="text-xl font-semibold text-white">{activeAsset.name}</h2>
              <p className="mt-2 text-sm text-slate-400">{activeAsset.description}</p>
            </div>

            <div className="grid gap-3">
              <div className="rounded-[1rem] border border-[rgba(148,163,184,0.12)] bg-slate-900/70 p-4">
                <div className="text-sm uppercase tracking-[0.22em] text-slate-400">Provider</div>
                <div className="mt-2 text-sm text-slate-100">{activeAsset.provider}</div>
              </div>
              <div className="rounded-[1rem] border border-[rgba(148,163,184,0.12)] bg-slate-900/70 p-4">
                <div className="text-sm uppercase tracking-[0.22em] text-slate-400">Version</div>
                <div className="mt-2 text-sm text-slate-100">{activeAsset.version}</div>
              </div>
              <div className="rounded-[1rem] border border-[rgba(148,163,184,0.12)] bg-slate-900/70 p-4">
                <div className="text-sm uppercase tracking-[0.22em] text-slate-400">Endpoint</div>
                <div className="mt-2 text-sm text-slate-100">{activeAsset.endpoint}</div>
              </div>
              <div className="rounded-[1rem] border border-[rgba(148,163,184,0.12)] bg-slate-900/70 p-4">
                <div className="text-sm uppercase tracking-[0.22em] text-slate-400">Authentication Type</div>
                <div className="mt-2 text-sm text-slate-100">{activeAsset.authenticationType}</div>
              </div>
              <div className="rounded-[1rem] border border-[rgba(148,163,184,0.12)] bg-slate-900/70 p-4">
                <div className="text-sm uppercase tracking-[0.22em] text-slate-400">Connected Tools</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {activeAsset.connectedTools.map((tool) => (
                    <span key={tool} className="rounded-full border border-[rgba(148,163,184,0.16)] bg-slate-950/60 px-3 py-1 text-sm text-slate-200">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-[1rem] border border-[rgba(148,163,184,0.12)] bg-slate-900/70 p-4">
                <div className="text-sm uppercase tracking-[0.22em] text-slate-400">Memory Enabled</div>
                <div className="mt-2 text-sm text-slate-100">{activeAsset.memoryEnabled ? 'Yes' : 'No'}</div>
              </div>
              <div className="rounded-[1rem] border border-[rgba(148,163,184,0.12)] bg-slate-900/70 p-4">
                <div className="text-sm uppercase tracking-[0.22em] text-slate-400">RAG Enabled</div>
                <div className="mt-2 text-sm text-slate-100">{activeAsset.ragEnabled ? 'Yes' : 'No'}</div>
              </div>
              <div className="rounded-[1rem] border border-[rgba(148,163,184,0.12)] bg-slate-900/70 p-4">
                <div className="text-sm uppercase tracking-[0.22em] text-slate-400">Evaluation Status</div>
                <div className="mt-2 text-sm text-slate-100">{activeAsset.evaluationStatus}</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button className="btn-primary" type="button" onClick={() => { void handleRegister(activeAsset) }}>
                Register for Evaluation
              </button>
              <button className="btn-secondary" type="button" onClick={() => navigate('/evaluations')}>
                View Previous Evaluations
              </button>
            </div>
          </div>
        ) : null}
      </Drawer>
    </main>
  )
}
