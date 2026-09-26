import { memo } from 'react'

import { cn } from '../../theme'
import { type BlockProps, BlockPropsEq } from './type'

const BlockComponent = ({ children, className, dataTest }: BlockProps) => {
  return (
    <div
      data-test={dataTest}
      data-component='Block'
      className={cn('pb-6 last:pb-0', className)}
    >
      {children}
    </div>
  )
}

export const BlockMemo = memo(BlockComponent, BlockPropsEq.equals)
