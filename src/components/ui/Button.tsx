import * as React from 'react'
import { cn } from '../../utils/classNames'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive'
export type ButtonSize = 'sm' | 'md' | 'lg'

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white shadow-glow hover:bg-primary-strong focus-visible:ring-primary/40',
  secondary: 'bg-slate-900/80 border border-[rgba(148,163,184,0.18)] text-slate-100 hover:bg-slate-900 focus-visible:ring-primary/25',
  ghost: 'bg-transparent text-slate-100 hover:bg-slate-800/80 focus-visible:ring-primary/25',
  destructive: 'bg-danger/10 text-danger border border-danger/20 hover:bg-danger/15 focus-visible:ring-danger/25'
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-10 px-4 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-base'
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-[1.15rem] border border-transparent font-medium transition duration-base ease-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-50',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    />
  )
}
