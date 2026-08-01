import React from 'react'

export type DeleteSize = 'small' | 'normal' | 'medium' | 'large'

export type DeleteProps = {
  size?: DeleteSize
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  className?: string
  key?: React.Key
  dataTest?: string
}
