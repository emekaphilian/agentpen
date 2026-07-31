import * as React from 'react'
import { cn } from '../../utils/classNames'

interface TooltipProps {
  content: string
  children: React.ReactNode
}

export function Tooltip({ content, children }: TooltipProps) {
  return (
    <div className="group relative inline-flex">
      {children}
      <div className="pointer-events-none absolute left-1/2 top-0 z-tooltip -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-[1rem] bg-slate-950/95 px-3 py-2 text-xs text-slate-100 opacity-0 transition duration-base ease-soft group-hover:opacity-100 group-focus-within:opacity-100">
        {content}
      </div>
    </div>
  )
}
