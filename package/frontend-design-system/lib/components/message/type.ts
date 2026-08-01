import React from 'react'

export type MessageVariant =
  'default' | 'primary' | 'info' | 'success' | 'warning' | 'danger'

export type MessageProps = {
  header?: React.ReactNode
  children: () => React.ReactNode
  variant?: MessageVariant
  onDelete?: () => void
  className?: string
  key?: React.Key
  dataTest?: string
}
