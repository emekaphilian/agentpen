export default function Topbar() {
  return (
    <div className="topbar">
      <div className="topbar-left">
        <h1>AgentPen</h1>
        <p>Configure and run adversarial probes</p>
      </div>
      <div className="topbar-right">
        <span className="badge badge-accent">v0.1.0</span>
        <button className="btn-ghost btn-sm" type="button">
          MITRE ATLAS ↗
        </button>
      </div>
    </div>
  )
}
