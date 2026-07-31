import * as React from 'react'

interface SectionHeaderProps {
  title: string
  description?: string
  trailing?: React.ReactNode
}

export function SectionHeader({ title, description, trailing }: SectionHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{title}</p>
        {description ? <p className="mt-1 text-sm text-slate-300">{description}</p> : null}
      </div>
      {trailing ? <div>{trailing}</div> : null}
    </div>
  )
}
