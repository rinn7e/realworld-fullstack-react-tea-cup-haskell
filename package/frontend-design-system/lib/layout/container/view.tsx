import React from 'react'

import { cn } from '../../theme'
import type { ContainerProps } from './type'

export const view = ({
  isFluid = false,
  children,
  className,
  key,
  dataTest,
}: ContainerProps): React.ReactElement => {
  return (
    <div
      key={key}
      data-test={dataTest}
      data-component='Container'
      className={cn(
        'mx-auto px-4 sm:px-6 lg:px-8',
        isFluid ? 'w-full max-w-none' : 'max-w-7xl',
        className,
      )}
    >
      {children()}
    </div>
  )
}
