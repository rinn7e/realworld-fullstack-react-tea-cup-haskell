import React from 'react'

export type TagColor = 'gray' | 'green' | 'dark-green' | 'sky' | 'amber' | 'red'

export type TagVariant = 'solid' | 'light' | 'outline'

export type TagSize = 'small' | 'normal' | 'medium' | 'large'

export type TagProps = {
  children?: () => React.ReactNode
  color?: TagColor
  variant?: TagVariant
  size?: TagSize
  isRounded?: boolean
  onDelete?: () => void
  onClick?: (e: React.MouseEvent<HTMLSpanElement>) => void
  key?: React.Key
  dataTest?: string
  className?: string
}
