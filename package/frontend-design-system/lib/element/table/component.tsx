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
  const content =
    typeof children === 'function'
      ? (children as () => React.ReactNode)()
      : children
  return (
    <div
      key={key}
      data-test={dataTest}
      data-component='Table'
      className='w-full overflow-x-auto rounded-lg border border-gray-200 shadow-2xs dark:border-zinc-800 dark:bg-black'
    >
      <table
        className={cn(
          'w-full text-left text-sm text-gray-700 dark:text-zinc-200',
          isFullWidth && 'w-full',
          isBordered &&
            'divide-x divide-y divide-gray-200 dark:divide-zinc-800',
          isStriped &&
            '[&_tr:nth-child(even)]:bg-gray-50/50 dark:[&_tr:nth-child(even)]:bg-zinc-900/50',
          isHoverable &&
            '[&_tbody_tr]:transition-colors [&_tbody_tr:hover]:bg-gray-100/60 dark:[&_tbody_tr:hover]:bg-zinc-800/60',
          className,
        )}
      >
        {content}
      </table>
    </div>
  )
}

export const TableMemo = memo(TableComponent, TablePropsEq.equals)
