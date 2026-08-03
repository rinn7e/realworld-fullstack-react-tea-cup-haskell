import React, { memo } from 'react'

import { cn } from '../../theme'
import { ContainerPropsEq, type ContainerProps } from './type'

export const ContainerComponent: React.FC<ContainerProps> = ({
  children,
  isFluid,
  className,
  key,
  dataTest,
}) => {
  return (
    <div
      key={key}
      data-test={dataTest}
      data-component='Container'
      className={cn(
        'mx-auto px-4',
        isFluid ? 'w-full' : 'max-w-7xl',
        className,
      )}
    >
      {children}
    </div>
  )
}

export const ContainerMemo = memo(ContainerComponent, ContainerPropsEq.equals)
