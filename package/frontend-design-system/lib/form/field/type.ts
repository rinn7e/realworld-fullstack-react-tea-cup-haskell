import React from 'react'

export type FieldProps = {
  label?: string
  helpText?: string
  errorText?: string
  isExpanded?: boolean
  children: () => React.ReactNode
  className?: string
  key?: React.Key
  dataTest?: string
}
