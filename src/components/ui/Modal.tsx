import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '../../utils/classNames'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
}

export function Modal({ open, onClose, title, description, children }: ModalProps) {
  return (
    <div
      className={cn(
        'fixed inset-0 z-modal flex items-center justify-center bg-black/70 p-4 transition-opacity duration-base',
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      )}
      aria-hidden={!open}
    >
      <div className="pointer-events-none absolute inset-0" onClick={onClose} />
      <div className="pointer-events-auto max-h-full w-full max-w-3xl overflow-hidden rounded-[1.5rem] border border-[rgba(148,163,184,0.18)] bg-slate-950/95 p-6 shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-slate-400">{title}</p>
            {description ? <p className="mt-2 text-slate-300">{description}</p> : null}
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-slate-300 transition hover:bg-slate-900/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30">
            <X className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Close modal</span>
          </button>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  )
}
