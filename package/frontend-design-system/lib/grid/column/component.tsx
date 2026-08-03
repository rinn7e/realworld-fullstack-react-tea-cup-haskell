import React, { memo } from 'react'

import { cn } from '../../theme'
import { ColumnPropsEq, type ColumnProps } from './type'

const sizeStyles: Record<string, string> = {
  full: 'w-full',
  half: 'w-full md:w-1/2',
  'one-third': 'w-full md:w-1/3',
  'two-thirds': 'w-full md:w-2/3',
  'one-quarter': 'w-full md:w-1/4',
  'three-quarters': 'w-full md:w-3/4',
}

export const ColumnComponent: React.FC<ColumnProps> = ({
  size,
  children,
  className,
  key,
  dataTest,
}) => {
  return (
    <div
      key={key}
      data-test={dataTest}
      className={cn(
        'flex-1',
        size ? sizeStyles[size] : 'w-full md:w-auto',
        className,
      )}
    >
      {children()}
    </div>
  )
}

export const ColumnMemo = memo(ColumnComponent, ColumnPropsEq.equals)
