import type React from 'react'
import type { ReactNode } from 'react'

export type ColumnsProps = {
  isMultiline?: boolean
  children: () => ReactNode
  className?: string
  key?: React.Key
  dataTest?: string
}
