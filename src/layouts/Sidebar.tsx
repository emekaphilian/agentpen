import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { label: 'Dashboard', to: '/', icon: '⚡' },
  { label: 'AI Systems', to: '/systems', icon: '📋' },
  { label: 'Discovery', to: '/discovery', icon: '🔎' },
  { label: 'Evaluations', to: '/evaluations', icon: '🧪' }
]

const reportItems = [
  { label: 'Evidence', to: '/evidence', icon: '📄' },
  { label: 'Assurance', to: '/reports', icon: '🕐' }
]

export default function Sidebar() {
  const location = useLocation()

  const isActive = (to: string) => location.pathname === to

  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-name">
          <span>Agent</span>Pen
        </div>
        <div className="logo-tag">AI assurance laboratory</div>
      </div>

      <nav>
        {navItems.map((item) => (
          <Link key={item.label} to={item.to} className={`nav-item${isActive(item.to) ? ' active' : ''}`}>
            <span className="icon">{item.icon}</span>
            {item.label}
          </Link>
        ))}

        <div className="nav-section">Reports</div>

        {reportItems.map((item) => (
          <Link key={item.label} to={item.to} className={`nav-item${isActive(item.to) ? ' active' : ''}`}>
            <span className="icon">{item.icon}</span>
            {item.label}
          </Link>
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
