interface NewScanPanelProps {
  targetUrl?: string
  apiKey?: string
  backendUrl?: string
  probeSelection?: string
  concurrency?: string
  timeout?: string
  preflightResult?: string
  progressLabel?: string
  progressPercent?: string
}

export default function NewScanPanel({
  targetUrl = 'https://your-agent.com/api/chat',
  apiKey = '',
  backendUrl = 'http://localhost:8080',
  probeSelection = 'all',
  concurrency = '4',
  timeout = '30',
  preflightResult = '',
  progressLabel = 'Initialising…',
  progressPercent = '0'
}: NewScanPanelProps) {
  return (
    <div className="view active" id="view-scan">
      <div className="card">
        <div className="card-title">Target configuration</div>
        <div className="form-grid" style={{ gridTemplateColumns: '2fr 1fr', marginBottom: '12px' }}>
          <div className="form-group">
            <label>Agent endpoint URL</label>
            <input type="url" id="target-url" placeholder="https://your-agent.com/api/chat" defaultValue={targetUrl} />
          </div>
          <div className="form-group">
            <label>API Key (optional)</label>
            <input type="password" id="api-key" placeholder="Bearer token" defaultValue={apiKey} />
          </div>
        </div>
        <div className="form-grid fg-4" style={{ marginBottom: '12px' }}>
          <div className="form-group">
            <label>Backend API URL</label>
            <input type="url" id="backend-url" placeholder="http://localhost:8080" defaultValue={backendUrl} />
          </div>
          <div className="form-group">
            <label>Probe selection</label>
            <select id="probe-sel" defaultValue={probeSelection}>
              <option value="all">All 10 probes</option>
              <option value="critical">Critical only (4)</option>
              <option value="high">High + Critical (8)</option>
              <option value="AP-001">AP-001 — Prompt injection</option>
              <option value="AP-002">AP-002 — Tool misuse</option>
              <option value="AP-003">AP-003 — Privilege escalation</option>
              <option value="AP-004">AP-004 — Data exfiltration</option>
              <option value="AP-005">AP-005 — Indirect injection</option>
              <option value="AP-006">AP-006 — Memory poisoning</option>
              <option value="AP-007">AP-007 — MCP manipulation</option>
              <option value="AP-008">AP-008 — Multi-agent trust</option>
              <option value="AP-009">AP-009 — Sys prompt leakage</option>
              <option value="AP-010">AP-010 — Goal hijacking</option>
            </select>
          </div>
          <div className="form-group">
            <label>Concurrency</label>
            <select id="concurrency" defaultValue={concurrency}>
              <option value="1">1 — sequential</option>
              <option value="4">4 — default</option>
              <option value="8">8 — fast</option>
            </select>
          </div>
          <div className="form-group">
            <label>Timeout (s)</label>
            <input type="number" id="timeout-val" min="5" max="120" defaultValue={timeout} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button className="btn-primary" type="button">
            ▶ Run Scan
          </button>
          <button className="btn-ghost" type="button">
            Check connectivity
          </button>
          <span style={{ fontSize: '12px' }}>{preflightResult}</span>
        </div>
      </div>

      <div id="scan-progress">
        <div className="progress-wrap">
          <div className="progress-meta">
            <span id="prog-label">{progressLabel}</span>
            <span id="prog-pct">{progressPercent}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" id="prog-bar" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
        <div className="terminal" id="scan-log">
          <div className="log-line">[12:00:00] Target → {targetUrl}</div>
          <div className="log-line">[12:00:01] Sending request to AgentPen API…</div>
          <div className="log-line log-ok">[12:00:05] Scan complete</div>
        </div>
      </div>
    </div>
  )
}
