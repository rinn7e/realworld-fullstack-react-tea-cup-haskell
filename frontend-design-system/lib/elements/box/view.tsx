import React from 'react'
import { cn } from '../../theme'
import type { BoxProps } from './type'

export const view = ({ children, className }: BoxProps): React.ReactElement => {
  return (
    <div
      className={cn(
        'rounded-xl border border-gray-200 bg-white p-6 shadow-xs text-gray-800 transition-all hover:shadow-md',
        className,
      )}
    >
      {children}
    </div>
  )
}
