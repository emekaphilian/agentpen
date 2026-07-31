import * as React from 'react'
import { cn } from '../../utils/classNames'

interface StatCardProps {
  label: string
  value: string
  delta?: string
  trend?: 'up' | 'down'
}

export function StatCard({ label, value, delta, trend }: StatCardProps) {
  return (
    <div className="surface-card border border-[rgba(148,163,184,0.12)] p-6 shadow-soft">
      <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{label}</p>
      <div className="mt-3 flex items-end justify-between gap-4">
        <p className="text-3xl font-medium tracking-tight text-slate-100">{value}</p>
        {delta ? (
          <span
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.22em]',
              trend === 'down' ? 'bg-orange-400/10 text-orange-300' : 'bg-emerald-500/10 text-emerald-300'
            )}
          >
            {delta}
          </span>
        ) : null}
      </div>
    </div>
  )
}
