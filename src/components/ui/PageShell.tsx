import * as React from 'react'
import { cn } from '../../utils/classNames'

interface PageShellProps {
  breadcrumb?: React.ReactNode
  title?: React.ReactNode
  subtitle?: React.ReactNode
  actions?: React.ReactNode
  children: React.ReactNode
}

export function PageShell({ breadcrumb, title, subtitle, actions, children }: PageShellProps) {
  return (
    <div className={cn('page-shell')}>
      {breadcrumb ? <div className="page-breadcrumb mb-6">{breadcrumb}</div> : null}
      {(title || subtitle || actions) && (
        <div className="mb-10 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-2">
            {subtitle ? <div className="text-sm text-text-secondary">{subtitle}</div> : null}
            {title ? <div className="text-3xl font-semibold text-text-primary">{title}</div> : null}
          </div>
          {actions ? <div className="page-actions">{actions}</div> : null}
        </div>
      )}
      <div className="page-content">{children}</div>
      <div className="page-footer-space" />
    </div>
  )
}
