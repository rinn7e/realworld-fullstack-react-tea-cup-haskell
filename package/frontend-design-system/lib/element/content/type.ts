import type React from 'react'
import type { ReactNode } from 'react'

export type ContentSize = 'small' | 'normal' | 'medium' | 'large'

export type ContentProps = {
  size?: ContentSize
  children: () => ReactNode
  className?: string
  key?: React.Key
  dataTest?: string
}
