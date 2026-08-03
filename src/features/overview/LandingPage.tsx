import { Link } from 'react-router-dom'

const featureCards = [
  {
    title: 'AI Discovery',
    description: 'Automatically discover models, agents, RAG systems, MCP servers, APIs, and tools across the estate.',
    bullets: ['Models', 'Agents', 'RAG Systems', 'MCP Servers', 'APIs', 'Tools']
  },
  {
    title: 'AI Assurance',
    description: 'Run evaluations across security, safety, reliability, fairness, and domain readiness in a unified workflow.',
    bullets: ['Security', 'Safety', 'Reliability', 'Fairness', 'Domain Readiness']
  },
  {
    title: 'Governance Ready',
    description: 'Produce verifiable assurance artifacts aligned with recognized governance frameworks and regulations.',
    bullets: ['NIST AI RMF', 'ISO/IEC 42001', 'MITRE ATLAS', 'OWASP Top 10 for LLM Applications', 'EU AI Act']
  }
]

const scores = [
  { label: 'Security score', value: '91' },
  { label: 'Safety score', value: '88' },
  { label: 'Reliability score', value: '94' },
  { label: 'Fairness score', value: '86' },
  { label: 'Domain readiness', value: '90' },
  { label: 'Overall assurance score', value: '91' }
]

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.18),transparent_32%),linear-gradient(180deg,#07070f_0%,#0d1324_100%)] text-slate-100">
      <section className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
        <div className="mb-8 flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 backdrop-blur">
          <div>
            <div className="text-lg font-semibold tracking-tight text-white">AgentPen</div>
            <div className="text-xs uppercase tracking-[0.32em] text-slate-400">AI Assurance Laboratory</div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/operations" className="btn-primary">Explore Operations Console</Link>
            <Link to="/executive" className="btn-secondary">Executive Dashboard</Link>
          </div>
        </div>

        <section className="grid gap-8 rounded-[28px] border border-white/10 bg-slate-950/55 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.6)] backdrop-blur md:grid-cols-[1.05fr_0.95fr] md:p-10">
          <div className="flex flex-col justify-center">
            <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-indigo-200">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(74,222,128,0.9)]" />
              Assurance-first platform
            </div>
            <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Evaluate AI systems with confidence.
            </h1>
            <p className="mt-5 max-w-2xl text-base text-slate-300 md:text-lg">
              AgentPen evaluates AI systems through Security, Safety, Reliability, Fairness, and Domain-specific testing, producing verifiable assurance evidence that organizations use to make trusted governance and deployment decisions.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/operations" className="btn-primary">Explore Operations Console</Link>
              <Link to="/executive" className="btn-secondary">Executive Dashboard</Link>
              <a href="https://github.com/emekaphilian/agentpen" target="_blank" rel="noreferrer" className="btn-secondary">GitHub Repository</a>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                <div className="text-2xl font-semibold text-white">5</div>
                <div className="text-xs uppercase tracking-[0.24em] text-slate-400">assurance pillars</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                <div className="text-2xl font-semibold text-white">24/7</div>
                <div className="text-xs uppercase tracking-[0.24em] text-slate-400">monitoring preview</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                <div className="text-2xl font-semibold text-white">NIST + ISO</div>
                <div className="text-xs uppercase tracking-[0.24em] text-slate-400">governance aligned</div>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-indigo-400/20 bg-[linear-gradient(180deg,rgba(15,23,42,0.96),rgba(12,18,33,0.9))] p-4 shadow-[0_26px_80px_rgba(76,29,149,0.35)]">
            <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/90 px-4 py-3">
              <div>
                <div className="text-[11px] uppercase tracking-[0.28em] text-slate-400">AI System</div>
                <div className="text-sm font-semibold text-white">Agentic Compliance Copilot</div>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                Live activity
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/90 p-4">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">Current evaluation stage</div>
                  <div className="text-sm font-semibold text-cyan-200">Evidence validation</div>
                </div>
                <div className="rounded-full border border-cyan-400/40 bg-cyan-500/10 px-3 py-1 text-[11px] text-cyan-200">Stage 4 / 5</div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {scores.map((metric) => (
                  <div key={metric.label} className="rounded-xl border border-white/10 bg-slate-900/75 p-3">
                    <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">{metric.label}</div>
                    <div className="mt-2 text-2xl font-semibold text-white">{metric.value}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-xl border border-indigo-400/20 bg-indigo-500/10 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.24em] text-slate-300">Overall Assurance Score</div>
                    <div className="text-3xl font-semibold text-white">91</div>
                  </div>
                  <div className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">Trusted deployment ready</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-3">
          {featureCards.map((card) => (
            <article key={card.title} className="rounded-[24px] border border-white/10 bg-slate-950/60 p-5 backdrop-blur">
              <div className="text-lg font-semibold text-white">{card.title}</div>
              <p className="mt-2 text-sm text-slate-300">{card.description}</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-200">
                {card.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-indigo-300" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>
      </section>
    </main>
  )
}
