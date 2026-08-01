import React from 'react'
import { cn } from '../../theme'
import type { TableProps } from './type'

export const view = ({
  isBordered = false,
  isStriped = false,
  isHoverable = false,
  isFullWidth = true,
  children,
  className,
}: TableProps): React.ReactElement => {
  return (
    <div data-component='Table' className='w-full overflow-x-auto rounded-lg border border-gray-200 shadow-2xs'>
      <table
        className={cn(
          'w-full text-left text-sm text-gray-700',
          isFullWidth && 'w-full',
          isBordered && 'divide-y divide-x divide-gray-200',
          isStriped && '[&_tr:nth-child(even)]:bg-gray-50/50',
          isHoverable && '[&_tbody_tr]:transition-colors [&_tbody_tr:hover]:bg-gray-100/60',
          className,
        )}
      >
        {children}
      </table>
    </div>
  )
}
