import React, { memo } from 'react'

import { cn } from '../../theme'
import { type ColumnsProps, ColumnsPropsEq } from './type'

export const ColumnsComponent: React.FC<ColumnsProps> = ({
  isMultiline,
  children,
  className,
  key,
  dataTest,
}) => {
  return (
    <div
      key={key}
      data-test={dataTest}
      data-component='Columns'
      className={cn(
        'flex flex-col gap-4 md:flex-row',
        isMultiline && 'flex-wrap',
        className,
      )}
    >
      {children}
    </div>
  )
}

export const ColumnsMemo = memo(ColumnsComponent, ColumnsPropsEq.equals)
