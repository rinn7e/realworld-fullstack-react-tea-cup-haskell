import { memo } from 'react'
import React from 'react'

import { cn } from '../../theme'
import { type BlockProps, BlockPropsEq } from './type'

export const BlockComponent: React.FC<BlockProps> = ({
  children,
  className,
  dataTest,
}) => {
  return (
    <div
      data-test={dataTest}
      data-component='Block'
      className={cn('mb-6 last:mb-0', className)}
    >
      {children}
    </div>
  )
}

export const BlockMemo = memo(BlockComponent, BlockPropsEq.equals)
