import * as React from 'react'
import { cn } from '../../utils/classNames'

interface TabItem {
  value: string
  label: string
}

interface TabsProps {
  items: TabItem[]
  value: string
  onChange: (value: string) => void
}

export function Tabs({ items, value, onChange }: TabsProps) {
  return (
    <div className="flex flex-wrap gap-2 rounded-[1.15rem] bg-slate-900/70 p-1">
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          onClick={() => onChange(item.value)}
          className={cn(
            'rounded-[1rem] px-4 py-2 text-sm transition duration-base ease-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
            value === item.value
              ? 'bg-slate-950 text-slate-100 shadow-glow'
              : 'text-slate-400 hover:bg-slate-800/70'
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}
