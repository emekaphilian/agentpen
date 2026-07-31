import * as React from 'react'
import { cn } from '../../utils/classNames'

interface PageHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
  description?: string
}

export function PageHeader({ title, subtitle, action, description }: PageHeaderProps) {
  return (
    <header className="mb-8 flex flex-col gap-4 rounded-[1.5rem] border border-[rgba(148,163,184,0.14)] bg-slate-950/88 p-6 shadow-soft">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          {subtitle ? <p className="mb-1 text-xs uppercase tracking-[0.22em] text-slate-500">{subtitle}</p> : null}
          <h1 className="text-3xl font-medium tracking-tight text-slate-100">{title}</h1>
        </div>
        {action ? <div>{action}</div> : null}
      </div>
      {description ? <p className="max-w-3xl text-sm leading-7 text-slate-300">{description}</p> : null}
    </header>
  )
}
