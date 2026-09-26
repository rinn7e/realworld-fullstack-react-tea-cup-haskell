import { memo } from 'react'

import { cn } from '../../theme'
import { type ContainerProps, ContainerPropsEq } from './type'

const ContainerComponent = ({
  children,
  isFluid,
  className,
  dataTest,
}: ContainerProps) => {
  return (
    <div
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
