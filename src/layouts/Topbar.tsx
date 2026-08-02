interface TopbarProps {
  title?: string
  meta?: string
}

export default function Topbar({ title = 'AI Assurance Laboratory', meta = 'Register AI systems, configure evaluations, review evidence, and generate assurance reports' }: TopbarProps) {
  return (
    <div className="topbar">
      <div className="topbar-left">
        <h1 id="view-title">{title}</h1>
        <p id="view-meta">{meta}</p>
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
