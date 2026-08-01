import React from 'react'

export type HeroVariant =
  | 'default'
  | 'primary'
  | 'link'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'
  | 'dark'

export type HeroSize = 'small' | 'normal' | 'medium' | 'large' | 'fullheight'

export type HeroProps = {
  children: React.ReactNode
  variant?: HeroVariant
  size?: HeroSize
  className?: string
}
