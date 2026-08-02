import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <main className="app-shell">
      <section className="hero-card">
        <div>
          <p className="eyebrow">AgentPen</p>
          <h1>AI assurance laboratory insights</h1>
          <p>
            Connect to the AgentPen backend and review AI systems, evaluation history, assurance evidence, and deployment recommendations.
          </p>
          <Link to="/systems" className="button button-primary">
            Browse Systems
          </Link>
        </div>
      </section>
    </main>
  )
}
