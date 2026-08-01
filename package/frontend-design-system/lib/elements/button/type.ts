import type React from 'react'
import type { ReactNode } from 'react'

export type ButtonVariant =
  'default' | 'primary' | 'link' | 'info' | 'success' | 'warning' | 'danger'

export type ButtonSize = 'small' | 'normal' | 'medium' | 'large'

export type ButtonProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  isOutlined?: boolean
  isRounded?: boolean
  isFullWidth?: boolean
  isLoading?: boolean
  isDisabled?: boolean
  children: () => ReactNode
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  type?: 'button' | 'submit' | 'reset'
  className?: string
  key?: React.Key
  dataTest?: string
}
