import * as React from 'react'

export function Spinner() {
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900/80 shadow-soft">
      <svg className="h-6 w-6 animate-spin text-primary" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
      <span className="sr-only">Loading</span>
    </div>
  )
}
