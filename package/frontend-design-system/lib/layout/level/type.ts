import type { ReactNode } from 'react'

export type LevelProps = {
  children: () => ReactNode
  className?: string
}

export type LevelItemProps = {
  hasTextCentered?: boolean
  children: () => ReactNode
  className?: string
}
