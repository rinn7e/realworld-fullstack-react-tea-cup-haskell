import { memo } from 'react'
import React from 'react'

import { cn } from '../../theme'
import { type BoxProps, BoxPropsEq } from './type'

export const BoxComponent: React.FC<BoxProps> = ({
  children,
  className,
  key,
  dataTest,
}) => {
  return (
    <div
      key={key}
      data-test={dataTest}
      data-component='Box'
      className={cn(
        'rounded-xl border border-gray-200 bg-white p-6 text-gray-800 shadow-xs transition-all hover:shadow-md',
        className,
      )}
    >
      {children}
    </div>
  )
}

export const BoxMemo = memo(BoxComponent, BoxPropsEq.equals)
