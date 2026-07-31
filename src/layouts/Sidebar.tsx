import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { label: 'New Scan', to: '/', icon: '⚡' },
  { label: 'Results', to: '/systems', icon: '📋' },
  { label: 'Probe Library', to: '/systems', icon: '🧪' },
  { label: 'Last Report', to: '/systems', icon: '📄' },
  { label: 'Scan History', to: '/systems', icon: '🕐' }
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
        <div className="logo-tag">AI agent security platform</div>
      </div>

      <nav>
        {navItems.map((item, index) => (
          <div key={item.label}>
            {index === 2 && <div className="nav-section">Reports</div>}
            <Link to={item.to} className={`nav-item${isActive(item.to) ? ' active' : ''}`}>
              <span className="icon">{item.icon}</span>
              {item.label}
            </Link>
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
