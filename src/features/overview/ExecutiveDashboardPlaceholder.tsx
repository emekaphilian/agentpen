import { Link } from 'react-router-dom'

export default function ExecutiveDashboardPlaceholder() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.18),transparent_32%),linear-gradient(180deg,#07070f_0%,#0d1324_100%)] text-slate-100">
      <section className="mx-auto max-w-4xl px-6 py-16 lg:px-10">
        <div className="rounded-[28px] border border-white/10 bg-slate-950/60 p-8 backdrop-blur">
          <div className="text-sm uppercase tracking-[0.32em] text-slate-400">Executive Dashboard</div>
          <h1 className="mt-3 text-3xl font-semibold text-white">Executive Summary Placeholder</h1>
          <p className="mt-4 max-w-2xl text-slate-300">
            This route is reserved for the executive-grade assurance overview. The live operational console remains intact and is available from the landing page.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/operations" className="btn-primary">Open Operations Console</Link>
            <Link to="/" className="btn-secondary">Return Home</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
