import type { ReactNode } from 'react'

export type HeroVariant =
  | 'default'
  | 'primary'
  | 'link'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'

export type HeroSize = 'small' | 'medium' | 'large' | 'fullheight'

export type HeroProps = {
  variant?: HeroVariant
  size?: HeroSize
  title?: ReactNode
  subtitle?: ReactNode
  header?: ReactNode
  footer?: ReactNode
  children?: ReactNode
  className?: string
}
