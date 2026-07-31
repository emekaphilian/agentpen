import * as React from 'react'

interface MetricCardProps {
  label: string
  value: string
  helpText?: string
  accent?: React.ReactNode
}

export function MetricCard({ label, value, helpText, accent }: MetricCardProps) {
  return (
    <div className="surface-card border border-[rgba(148,163,184,0.12)] p-6 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-medium tracking-tight text-slate-100">{value}</p>
        </div>
        {accent ? <div>{accent}</div> : null}
      </div>
      {helpText ? <p className="mt-4 text-sm text-slate-400">{helpText}</p> : null}
    </div>
  )
}
