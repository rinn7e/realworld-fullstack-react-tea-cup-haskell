import React from 'react'

export type ContainerProps = {
  children: () => React.ReactNode
  isFluid?: boolean
  className?: string
}
