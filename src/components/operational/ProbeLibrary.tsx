const probes = [
  { id: 'AP-001', name: 'Prompt injection', sev: 'critical', atlas: 'AML.T0051', tactic: 'ML Attack Staging', payloads: 4 },
  { id: 'AP-002', name: 'Tool misuse / resource abuse', sev: 'high', atlas: 'AML.T0043', tactic: 'ML Attack Staging', payloads: 5 },
  { id: 'AP-003', name: 'Privilege escalation', sev: 'critical', atlas: 'AML.T0040', tactic: 'Privilege Escalation', payloads: 6 },
  { id: 'AP-004', name: 'Data exfiltration', sev: 'high', atlas: 'AML.T0037', tactic: 'Exfiltration', payloads: 6 }
]

const sevClassMap: Record<string, string> = {
  critical: 'badge-critical',
  high: 'badge-high',
  medium: 'badge-medium',
  low: 'badge-low'
}

interface ProbeLibraryProps {
  pillars?: string[]
  selectedSystemName?: string
}

export default function ProbeLibrary({ pillars = ['Security', 'Safety', 'Reliability'], selectedSystemName = 'Selected system' }: ProbeLibraryProps) {
  return (
    <div className="view" id="view-probes">
      <div className="card" style={{ marginBottom: '12px' }}>
        <div className="card-title">Assurance focus</div>
        <div className="system-meta" style={{ marginBottom: '8px' }}>{selectedSystemName}</div>
        <div className="pillar-list">
          {pillars.map((pillar) => (
            <span key={pillar} className="pillar-chip active">
              {pillar}
            </span>
          ))}
        </div>
      </div>
      <div className="probe-grid" id="probe-grid">
        {probes.map((probe) => (
          <div className="probe-card" key={probe.id}>
            <div className="probe-card-id">{probe.id}</div>
            <div className="probe-card-name">{probe.name}</div>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '6px' }}>
              <span className={`badge ${sevClassMap[probe.sev]}`}>{probe.sev.toUpperCase()}</span>
              <span className="probe-card-meta">{probe.atlas}</span>
            </div>
            <div className="probe-card-meta">
              {probe.tactic} · {probe.payloads} payloads
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
