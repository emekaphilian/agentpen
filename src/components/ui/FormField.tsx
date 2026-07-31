import * as React from 'react'
import { cn } from '../../utils/classNames'

interface FormFieldProps {
  label: string
  htmlFor: string
  helperText?: string
  validationText?: string
  validationState?: 'error' | 'success' | 'warning'
  children: React.ReactNode
}

const validationStyles: Record<NonNullable<FormFieldProps['validationState']>, string> = {
  error: 'text-critical',
  success: 'text-success',
  warning: 'text-warning'
}

export function FormField({
  label,
  htmlFor,
  helperText,
  validationText,
  validationState,
  children
}: FormFieldProps) {
  return (
    <div className="form-field">
      <label htmlFor={htmlFor} className="form-label">
        {label}
      </label>
      {children}
      {helperText ? <p className="form-helper">{helperText}</p> : null}
      {validationText ? (
        <p className={cn('form-validation', validationState ? validationStyles[validationState] : '')}>
          {validationText}
        </p>
      ) : null}
    </div>
  )
}
