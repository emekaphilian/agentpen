import * as React from 'react'
import { cn } from '../../utils/classNames'

export type TypographyVariant =
  | 'display'
  | 'heading-xl'
  | 'heading-l'
  | 'heading-m'
  | 'heading-s'
  | 'body-large'
  | 'body'
  | 'body-small'
  | 'caption'
  | 'code'

const variantClasses: Record<TypographyVariant, string> = {
  display: 'typography-display',
  'heading-xl': 'typography-heading-xl',
  'heading-l': 'typography-heading-l',
  'heading-m': 'typography-heading-m',
  'heading-s': 'typography-heading-s',
  'body-large': 'typography-body-large',
  body: 'typography-body',
  'body-small': 'typography-body-small',
  caption: 'typography-caption',
  code: 'typography-code font-mono bg-surface-elevated px-2 py-1 rounded-[0.85rem]'
}

export type TypographyProps<As extends React.ElementType = 'p'> = {
  variant?: TypographyVariant
  as?: As
  className?: string
} & Omit<React.ComponentPropsWithoutRef<As>, 'as' | 'className'>

export function Typography<As extends React.ElementType = 'p'>({
  as,
  variant = 'body',
  className,
  ...props
}: TypographyProps<As>) {
  const Component = (as || 'p') as React.ElementType
  return <Component className={cn(variantClasses[variant], className)} {...props} />
}
