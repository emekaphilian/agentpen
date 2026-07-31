import * as React from 'react'
import { cn } from '../../utils/classNames'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'w-full rounded-[1rem] border border-[rgba(148,163,184,0.16)] bg-slate-950/88 px-4 py-3 text-sm text-slate-100 shadow-sm outline-none transition duration-base ease-soft placeholder:text-slate-500 focus:border-primary focus-visible:ring-primary/30',
        className
      )}
      {...props}
    />
  )
)
Input.displayName = 'Input'
