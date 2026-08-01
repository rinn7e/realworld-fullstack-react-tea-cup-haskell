import React from 'react'

export type IconSize = 'small' | 'normal' | 'medium' | 'large'

export type IconProps = {
  children: () => React.ReactNode
  size?: IconSize
  className?: string
  key?: React.Key
  dataTest?: string
}
