import React from 'react'

import { cn } from '../../theme'
import type { ColumnsProps } from './type'

export const view = ({
  isMultiline = false,
  children,
  className,
}: ColumnsProps): React.ReactElement => {
  return (
    <div
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
