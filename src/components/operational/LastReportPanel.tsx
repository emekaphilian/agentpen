interface LastReportPanelProps {
  scanId?: string
  generatedAt?: string
  targetUrl?: string
  riskScore?: string | number
  riskBand?: string
  probesRun?: string | number
  atlasCount?: string | number
  vulnerable?: string | number
  findings?: Array<{
    id: string
    probeName: string
    severity: string
    verdict: string
    atlas: string
    evidence: string
    remediation: string[]
  }>
}

export default function LastReportPanel({
  scanId = 'scan-001',
  generatedAt = '2026-08-01 12:00:00',
  targetUrl = 'https://your-agent.com/api/chat',
  riskScore = 78,
  riskBand = 'HIGH',
  probesRun = 10,
  atlasCount = 6,
  vulnerable = 4,
  findings = [
    {
      id: 'AP-001',
      probeName: 'Direct prompt injection',
      severity: 'critical',
      verdict: 'vulnerable',
      atlas: 'AML.T0051',
      evidence: 'The agent followed a malicious instruction sequence without safeguards.',
      remediation: ['Add strict instruction policy enforcement.', 'Require confirmation for untrusted commands.']
    }
  ]
}: LastReportPanelProps) {
  const accentColor = riskBand === 'CRITICAL' || riskBand === 'HIGH' ? '#f87171' : riskBand === 'MEDIUM' ? '#fbbf24' : '#4ade80'

  return (
    <div className="view" id="view-report">
      <div className="empty" id="report-empty" style={{ display: 'none' }}>
        <div className="empty-icon">📄</div>
        <p>No report yet. Complete a scan first.</p>
        <button className="btn-primary" type="button">
          Run a scan
        </button>
      </div>
      <div id="report-data">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
            <div>
              <div className="card-title" style={{ marginBottom: 4 }}>
                Security Assessment Report
              </div>
              <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                Scan ID: {scanId} · Generated: {generatedAt} · Target: {targetUrl}
              </div>
            </div>
            <button className="btn-ghost btn-sm" type="button">
              ⬇ Export Markdown
            </button>
          </div>
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '1rem' }}>
              <div style={{ background: 'var(--bg3)', borderRadius: '8px', padding: '0.875rem', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Risk Score</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 600, color: accentColor }}>{riskScore}/100</div>
                <div style={{ fontSize: '11px', color: accentColor }}>{riskBand}</div>
              </div>
              <div style={{ background: 'var(--bg3)', borderRadius: '8px', padding: '0.875rem', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Probes Run</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{probesRun}</div>
                <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{atlasCount} ATLAS techniques</div>
              </div>
              <div style={{ background: 'var(--bg3)', borderRadius: '8px', padding: '0.875rem', textAlign: 'center' }}>
                <div style={{ fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Vulnerable</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 600, color: '#f87171' }}>{vulnerable}</div>
                <div style={{ fontSize: '11px', color: 'var(--muted)' }}>of {probesRun} probes</div>
              </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '12px', fontWeight: 500, marginBottom: '8px' }}>Framework Coverage</div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                <span className="badge badge-accent">MITRE ATLAS</span>
                <span className="badge" style={{ background: 'rgba(99,102,241,0.08)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)' }}>OWASP LLM Top 10</span>
                <span className="badge" style={{ background: 'rgba(99,102,241,0.08)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)' }}>NIST AI RMF</span>
                <span className="badge" style={{ background: 'rgba(99,102,241,0.08)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)' }}>EU AI Act</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--muted)' }}>ATLAS techniques: AML.T0051, AML.T0043, AML.T0040</div>
              <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '3px' }}>NIST AI RMF: Governance, Mapping, Measurement, Management</div>
            </div>
          </div>
        </div>
        <div>
          {findings.map((finding) => (
            <div className="finding-row" key={finding.id}>
              <div className="finding-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="mono">{finding.id}</span>
                  <span style={{ fontWeight: 500 }}>{finding.probeName}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span className={`badge ${finding.severity === 'critical' ? 'badge-critical' : finding.severity === 'high' ? 'badge-high' : 'badge-medium'}`}>{finding.severity.toUpperCase()}</span>
                  <span className={`badge ${finding.verdict === 'vulnerable' ? 'badge-vuln' : finding.verdict === 'inconclusive' ? 'badge-inc' : 'badge-res'}`}>{finding.verdict === 'vulnerable' ? '✗ Vulnerable' : finding.verdict === 'inconclusive' ? '? Inconclusive' : '✓ Resistant'}</span>
                  <span style={{ color: 'var(--muted)', fontSize: '16px' }}>›</span>
                </div>
              </div>
              <div className="finding-body open">
                <p>
                  <strong>ATLAS:</strong> <span className="mono">{finding.atlas}</span>
                </p>
                <p>
                  <strong>OWASP LLM Top 10:</strong> LLM01 Prompt Injection
                </p>
                <p>
                  <strong>EU AI Act:</strong> Article 15
                </p>
                <p>
                  <strong>CWE:</strong> CWE-77
                </p>
                <p style={{ marginTop: '8px' }}>
                  <strong>Evidence:</strong> {finding.evidence}
                </p>
                <p style={{ marginTop: '8px' }}>
                  <strong>Remediation:</strong>
                </p>
                <ol className="rem-list">
                  {finding.remediation.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ol>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
