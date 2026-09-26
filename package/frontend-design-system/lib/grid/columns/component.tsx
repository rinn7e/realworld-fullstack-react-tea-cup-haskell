import { memo } from 'react'

import { cn } from '../../theme'
import { type ColumnsProps, ColumnsPropsEq } from './type'

const ColumnsComponent = ({
  isMultiline,
  children,
  className,
  dataTest,
}: ColumnsProps) => {
  return (
    <div
      data-test={dataTest}
      data-component='Columns'
      className={cn(
        'flex flex-col gap-4 lg:flex-row',
        isMultiline && 'flex-wrap',
        className,
      )}
    >
      {children}
    </div>
  )
}

export const ColumnsMemo = memo(ColumnsComponent, ColumnsPropsEq.equals)
