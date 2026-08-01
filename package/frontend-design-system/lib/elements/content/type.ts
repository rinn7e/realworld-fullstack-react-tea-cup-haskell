import type { ReactNode } from 'react'

export type ContentSize = 'small' | 'normal' | 'medium' | 'large'

export type ContentProps = {
  size?: ContentSize
  children: ReactNode
  className?: string
}
