import { memo } from 'react'
import React from 'react'

import { cn } from '../../theme'
import { type TableProps, TablePropsEq } from './type'

export const TableComponent: React.FC<TableProps> = ({
  isBordered = false,
  isStriped = false,
  isHoverable = false,
  isFullWidth = true,
  children,
  className,
  key,
  dataTest,
}) => {
  return (
    <div
      key={key}
      data-test={dataTest}
      data-component='Table'
      className='w-full overflow-x-auto rounded-lg border border-gray-200 shadow-2xs'
    >
      <table
        className={cn(
          'w-full text-left text-sm text-gray-700',
          isFullWidth && 'w-full',
          isBordered && 'divide-x divide-y divide-gray-200',
          isStriped && '[&_tr:nth-child(even)]:bg-gray-50/50',
          isHoverable &&
            '[&_tbody_tr]:transition-colors [&_tbody_tr:hover]:bg-gray-100/60',
          className,
        )}
      >
        {children()}
      </table>
    </div>
  )
}

export const TableMemo = memo(TableComponent, TablePropsEq.equals)
