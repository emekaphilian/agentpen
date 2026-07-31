import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '../../utils/classNames'

interface DrawerProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  side?: 'right' | 'left'
}

export function Drawer({ open, onClose, title, children, side = 'right' }: DrawerProps) {
  return (
    <div className="fixed inset-0 z-drawer flex overflow-hidden" aria-hidden={!open}>
      <button
        type="button"
        className={cn(
          'absolute inset-0 bg-black/60 transition-opacity duration-base',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />
      <div
        className={cn(
          'relative h-full w-full max-w-[28rem] border-l border-[rgba(148,163,184,0.14)] bg-slate-950/96 shadow-lg transition-transform duration-base',
          side === 'left' ? 'translate-x-0 md:-translate-x-0' : 'translate-x-0',
          open ? 'translate-x-0' : side === 'right' ? 'translate-x-full' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between border-b border-[rgba(148,163,184,0.12)] px-6 py-5">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-slate-400">{title}</p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-slate-300 transition hover:bg-slate-900/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30">
            <X className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Close drawer</span>
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-6">{children}</div>
      </div>
    </div>
  )
}
