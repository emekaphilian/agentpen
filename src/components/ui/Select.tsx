import * as React from 'react'
import { cn } from '../../utils/classNames'
import { ChevronDown } from 'lucide-react'

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => (
    <div className={cn('relative w-full', className)}>
      <select
        ref={ref}
        className="appearance-none w-full rounded-[1rem] border border-[rgba(148,163,184,0.16)] bg-slate-950/88 px-4 py-3 pr-10 text-sm text-slate-100 shadow-sm outline-none transition duration-base ease-soft focus:border-primary focus-visible:ring-primary/30"
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </div>
  )
)
Select.displayName = 'Select'
