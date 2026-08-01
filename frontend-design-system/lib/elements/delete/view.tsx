import React from 'react'
import { X } from 'lucide-react'
import { cn } from '../../theme'
import type { DeleteProps } from './type'

const sizeStyles: Record<string, string> = {
  small: 'h-4 w-4 p-0.5',
  normal: 'h-5 w-5 p-1',
  medium: 'h-6 w-6 p-1',
  large: 'h-8 w-8 p-1.5',
}

export const view = ({
  size = 'normal',
  onClick,
  className,
}: DeleteProps): React.ReactElement => {
  return (
    <button
      data-component='Delete'
      type='button'
      onClick={onClick}
      aria-label='delete'
      className={cn(
        'inline-flex cursor-pointer items-center justify-center rounded-full bg-gray-900/20 text-white transition-all hover:bg-gray-900/40 focus:outline-none focus:ring-2 focus:ring-gray-400',
        sizeStyles[size],
        className,
      )}
    >
      <X className='h-full w-full' />
    </button>
  )
}
