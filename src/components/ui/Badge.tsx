import * as React from 'react'
import { cn } from '../../utils/classNames'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'neutral' | 'success' | 'warning' | 'danger' | 'info'
}

const variantStyles: Record<NonNullable<BadgeProps['variant']>, string> = {
  neutral: 'bg-slate-900/90 text-slate-200 border border-[rgba(148,163,184,0.12)]',
  success: 'bg-emerald-500/10 text-emerald-300 border border-emerald-400/10',
  warning: 'bg-amber-500/10 text-amber-300 border border-amber-400/10',
  danger: 'bg-orange-400/10 text-orange-300 border border-orange-400/12',
  info: 'bg-sky-400/10 text-sky-300 border border-sky-400/10'
}

export function Badge({ className, variant = 'neutral', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-slate-100/85',
        variantStyles[variant],
        className
      )}
      {...props}
    />
  )
}
