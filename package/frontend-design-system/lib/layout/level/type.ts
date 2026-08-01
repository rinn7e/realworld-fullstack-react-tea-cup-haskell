import type React from 'react'
import type { ReactNode } from 'react'

export type LevelProps = {
  children: () => ReactNode
  className?: string
  key?: React.Key
  dataTest?: string
}

export type LevelItemProps = {
  hasTextCentered?: boolean
  children: () => ReactNode
  className?: string
  key?: React.Key
  dataTest?: string
}
