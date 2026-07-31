import * as React from 'react'
import { Spinner } from './Spinner'

interface LoadingStateProps {
  label?: string
}

export function LoadingState({ label = 'Loading…' }: LoadingStateProps) {
  return (
    <div className="surface-card border border-[rgba(148,163,184,0.12)] flex flex-col items-center justify-center gap-4 py-12 text-center text-slate-300">
      <Spinner />
      <p className="text-sm text-slate-300">{label}</p>
    </div>
  )
}
