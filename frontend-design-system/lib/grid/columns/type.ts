import React from 'react'

export type ColumnWidth = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

export type ColumnsProps = {
  children: React.ReactNode
  isMultiline?: boolean
  isCentered?: boolean
  isGapless?: boolean
  className?: string
}

export type ColumnProps = {
  children: React.ReactNode
  span?: ColumnWidth
  className?: string
}
