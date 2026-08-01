import React from 'react'

export type TableProps = {
  children: () => React.ReactNode
  isBordered?: boolean
  isStriped?: boolean
  isNarrow?: boolean
  isHoverable?: boolean
  isFullWidth?: boolean
  className?: string
}
