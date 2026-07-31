import * as React from 'react'
import { cn } from '../../utils/classNames'

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {}

export function Table({ className, children, ...props }: TableProps) {
  return (
    <div className={cn('overflow-x-auto rounded-[1.25rem] border border-[rgba(148,163,184,0.16)] bg-slate-950/88 shadow-soft', className)}>
      <table className="min-w-full border-separate border-spacing-0 text-left text-sm" {...props}>
        {children}
      </table>
    </div>
  )
}

export function TableHeader({ children }: { children: React.ReactNode }) {
  return (
    <thead className="border-b border-[rgba(148,163,184,0.12)] text-slate-400">
      {children}
    </thead>
  )
}

export function TableRow({ children }: { children: React.ReactNode }) {
  return <tr className="odd:bg-slate-950/60 even:bg-slate-900/60">{children}</tr>
}

export function TableCell({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={cn('px-6 py-4 align-top text-slate-100', className)}>{children}</td>
}

export function TableHeaderCell({ children, className }: { children: React.ReactNode; className?: string }) {
  return <th className={cn('px-6 py-4 font-medium text-slate-300', className)}>{children}</th>
}
