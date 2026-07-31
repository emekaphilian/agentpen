const probes = [
  { id: 'AP-001', name: 'Direct prompt injection', sev: 'critical', atlas: 'AML.T0051', tactic: 'ML Attack Staging', payloads: 4 },
  { id: 'AP-002', name: 'Tool misuse / resource abuse', sev: 'high', atlas: 'AML.T0043', tactic: 'ML Attack Staging', payloads: 5 },
  { id: 'AP-003', name: 'Privilege escalation', sev: 'critical', atlas: 'AML.T0040', tactic: 'Privilege Escalation', payloads: 6 },
  { id: 'AP-004', name: 'Data exfiltration', sev: 'high', atlas: 'AML.T0037', tactic: 'Exfiltration', payloads: 6 },
  { id: 'AP-005', name: 'Indirect injection (RAG/tools)', sev: 'critical', atlas: 'AML.T0051.002', tactic: 'Initial Access', payloads: 4 },
  { id: 'AP-006', name: 'Memory poisoning', sev: 'critical', atlas: 'AML.T0053', tactic: 'Persistence', payloads: 5 },
  { id: 'AP-007', name: 'MCP manipulation', sev: 'high', atlas: 'AML.T0043.002', tactic: 'ML Attack Staging', payloads: 5 },
  { id: 'AP-008', name: 'Multi-agent trust exploit', sev: 'high', atlas: 'AML.T0056', tactic: 'Initial Access', payloads: 5 },
  { id: 'AP-009', name: 'System prompt extraction', sev: 'medium', atlas: 'AML.T0056', tactic: 'Discovery', payloads: 6 },
  { id: 'AP-010', name: 'Goal hijacking', sev: 'high', atlas: 'AML.T0054', tactic: 'Impact', payloads: 5 }
]

const sevClassMap: Record<string, string> = {
  critical: 'badge-critical',
  high: 'badge-high',
  medium: 'badge-medium',
  low: 'badge-low'
}

export default function ProbeLibrary() {
  return (
    <div className="view" id="view-probes">
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
