import * as React from 'react'
import { cn } from '../../utils/classNames'

interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: 'healthy' | 'at-risk' | 'warning' | 'offline'
}

const statusStyles: Record<StatusBadgeProps['status'], string> = {
  healthy: 'bg-emerald-500/12 text-emerald-300 border border-emerald-500/10',
  'at-risk': 'bg-amber-500/12 text-amber-300 border border-amber-500/10',
  warning: 'bg-orange-400/12 text-orange-300 border border-orange-400/12',
  offline: 'bg-slate-700/80 text-slate-200 border border-slate-600/50'
}

export function StatusBadge({ status, className, ...props }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-3 py-1 text-sm font-medium tracking-[0.18em]',
        statusStyles[status],
        className
      )}
      {...props}
    />
  )
}
