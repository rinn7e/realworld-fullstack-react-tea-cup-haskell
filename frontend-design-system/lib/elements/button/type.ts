import React from 'react'

export type ButtonVariant =
  | 'default'
  | 'primary'
  | 'link'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'
  | 'dark'
  | 'light'

export type ButtonSize = 'small' | 'normal' | 'medium' | 'large'

export type ButtonProps = {
  children?: React.ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  isOutlined?: boolean
  isRounded?: boolean
  isLoading?: boolean
  isFullWidth?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  className?: string
}
