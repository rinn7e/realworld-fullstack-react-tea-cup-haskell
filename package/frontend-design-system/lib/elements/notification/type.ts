import React from 'react'

export type NotificationVariant =
  'default' | 'primary' | 'link' | 'info' | 'success' | 'warning' | 'danger'

export type NotificationProps = {
  children: () => React.ReactNode
  variant?: NotificationVariant
  onDelete?: () => void
  className?: string
}
