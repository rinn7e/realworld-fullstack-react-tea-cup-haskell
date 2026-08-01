import React from 'react'

export type TitleSize = 1 | 2 | 3 | 4 | 5 | 6

export type TitleProps = {
  children: () => React.ReactNode
  size?: TitleSize
  isSubtitle?: boolean
  className?: string
}
