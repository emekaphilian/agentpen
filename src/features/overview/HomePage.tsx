import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <main className="app-shell">
      <section className="hero-card">
        <div>
          <p className="eyebrow">AgentPen</p>
          <h1>AI agent security and audit insights</h1>
          <p>
            Connect to the AgentPen backend and review discovered systems, scan history, and risk signals.
          </p>
          <Link to="/systems" className="button button-primary">
            Browse Systems
          </Link>
        </div>
      </section>
    </main>
  )
}
