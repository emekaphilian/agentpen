import * as React from 'react'
import { cn } from '../../utils/classNames'

interface EmptyStateProps {
  title: string
  description: string
  icon?: React.ReactNode
}

export function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <div className={cn('surface-card border border-[rgba(148,163,184,0.12)] text-slate-300', 'flex flex-col items-center justify-center gap-4 py-12 text-center')}>
      {icon ? <div className="text-primary">{icon}</div> : null}
      <div>
        <p className="mb-2 text-sm uppercase tracking-[0.2em] text-slate-500">{title}</p>
        <p className="max-w-xl text-sm leading-7 text-slate-300">{description}</p>
      </div>
    </div>
  )
}
