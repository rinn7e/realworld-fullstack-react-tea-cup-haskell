import React from 'react'

export type TagVariant =
  | 'default'
  | 'primary'
  | 'link'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'
  | 'dark'
  | 'light'

export type TagSize = 'small' | 'normal' | 'medium' | 'large'

export type TagProps = {
  children?: () => React.ReactNode
  variant?: TagVariant
  size?: TagSize
  isRounded?: boolean
  isLight?: boolean
  isOutline?: boolean
  onDelete?: () => void
  onClick?: (e: React.MouseEvent<HTMLSpanElement>) => void
  className?: string
}
