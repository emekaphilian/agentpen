import * as React from 'react'
import { cn } from '../../utils/classNames'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string
  height?: string
}

export function Skeleton({ className, width = '100%', height = '1rem', ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-[1rem] bg-slate-800/90',
        className
      )}
      style={{ width, height }}
      {...props}
    />
  )
}
