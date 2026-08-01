import type React from 'react'
import type { ReactNode } from 'react'

export type ButtonColor =
  'white' | 'green' | 'dark-green' | 'sky' | 'amber' | 'red' | 'gray'

export type ButtonVariant = 'solid' | 'outline' | 'link' | 'ghost'

export type ButtonSize = 'xsmall' | 'small' | 'normal' | 'medium' | 'large'

export type ButtonProps = {
  color?: ButtonColor
  variant?: ButtonVariant
  size?: ButtonSize
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
