import type React from 'react'
import type { ReactNode } from 'react'

export type ColumnSize =
  | 'full'
  | 'half'
  | 'one-third'
  | 'two-thirds'
  | 'one-quarter'
  | 'three-quarters'

export type ColumnProps = {
  size?: ColumnSize
  children: () => ReactNode
  className?: string
  key?: React.Key
  dataTest?: string
}
