interface OperationalHeaderProps {
  title?: string
  meta?: string
}

export default function OperationalHeader({
  title = 'New Scan',
  meta = 'Configure and run adversarial probes'
}: OperationalHeaderProps) {
  return (
    <div className="topbar">
      <div className="topbar-left">
        <h1 id="view-title">{title}</h1>
        <p id="view-meta">{meta}</p>
      </div>
      <div className="topbar-right">
        <span className="badge badge-accent">v0.1.0</span>
        <button
          className="btn-ghost btn-sm"
          onClick={() => window.open('https://atlas.mitre.org', '_blank')}
          type="button"
        >
          MITRE ATLAS ↗
        </button>
      </div>
    </div>
  )
}
