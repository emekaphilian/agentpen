import * as React from 'react'
import { cn } from '../../utils/classNames'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated'
}

const variantStyles: Record<NonNullable<CardProps['variant']>, string> = {
  default: 'bg-slate-950/88 border border-[rgba(148,163,184,0.16)] shadow-soft',
  elevated: 'bg-slate-950/96 border border-[rgba(148,163,184,0.18)] shadow-lg'
}

export function Card({ className, variant = 'default', ...props }: CardProps) {
  return (
    <div
      className={cn('rounded-[1.5rem] p-6 transition shadow-soft', variantStyles[variant], className)}
      {...props}
    />
  )
}
