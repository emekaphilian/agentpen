interface OperationalSidebarProps {
  activeItem?: string
  onNavigate?: (id: string) => void
}

const navigationItems = [
  { id: 'scan', label: 'New Scan', icon: '⚡' },
  { id: 'results', label: 'Results', icon: '📋' },
  { id: 'probes', label: 'Probe Library', icon: '🧪' },
  { id: 'report', label: 'Last Report', icon: '📄' },
  { id: 'history', label: 'Scan History', icon: '🕐' }
]

export default function OperationalSidebar({
  activeItem = 'scan',
  onNavigate
}: OperationalSidebarProps) {
  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-name">
          <span>Agent</span>Pen
        </div>
        <div className="logo-tag">AI agent security platform</div>
      </div>
      <nav>
        {navigationItems.slice(0, 3).map((item) => (
          <div
            key={item.id}
            className={`nav-item${activeItem === item.id ? ' active' : ''}`}
            onClick={() => onNavigate?.(item.id)}
            id={`nav-${item.id}`}
          >
            <span className="icon">{item.icon}</span> {item.label}
          </div>
        ))}
        <div className="nav-section">Reports</div>
        {navigationItems.slice(3).map((item) => (
          <div
            key={item.id}
            className={`nav-item${activeItem === item.id ? ' active' : ''}`}
            onClick={() => onNavigate?.(item.id)}
            id={`nav-${item.id}`}
          >
            <span className="icon">{item.icon}</span> {item.label}
          </div>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="ver">AgentPen v0.1.0</div>
        <div className="frameworks">
          MITRE ATLAS · OWASP LLM Top 10
          <br />
          NIST AI RMF · EU AI Act
        </div>
      </div>
    </aside>
  )
}
