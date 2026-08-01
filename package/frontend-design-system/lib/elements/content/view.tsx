import React from 'react'

import { cn } from '../../theme'
import type { ContentProps } from './type'

const sizeStyles: Record<string, string> = {
  small: 'text-xs leading-relaxed',
  normal: 'text-sm leading-relaxed',
  medium: 'text-base leading-relaxed',
  large: 'text-lg leading-relaxed',
}

export const view = ({
  size = 'normal',
  children,
  className,
}: ContentProps): React.ReactElement => {
  return (
    <div
      data-component='Content'
      className={cn(
        'prose max-w-none space-y-4 text-gray-700',
        sizeStyles[size],
        className,
      )}
    >
      {children()}
    </div>
  )
}
