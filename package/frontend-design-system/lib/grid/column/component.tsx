import { memo } from 'react'

import { cn } from '../../theme'
import { type ColumnProps, ColumnPropsEq, type ColumnSize } from './type'

const sizeStyles: Record<ColumnSize, string> = {
  full: 'w-full',
  half: 'w-full lg:w-1/2',
  'one-third': 'w-full lg:w-1/3',
  'two-thirds': 'w-full lg:w-2/3',
  'one-quarter': 'w-full lg:w-1/4',
  'three-quarters': 'w-full lg:w-3/4',
}

const ColumnComponent = ({
  size,
  children,
  className,
  dataTest,
}: ColumnProps) => {
  return (
    <div
      data-test={dataTest}
      data-component='Column'
      className={cn(
        'flex-1',
        size ? sizeStyles[size] : 'w-full lg:w-auto',
        className,
      )}
    >
      {children}
    </div>
  )
}

export const ColumnMemo = memo(ColumnComponent, ColumnPropsEq.equals)
