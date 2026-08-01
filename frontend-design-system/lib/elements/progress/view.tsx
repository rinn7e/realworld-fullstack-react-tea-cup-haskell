import React from 'react'
import { cn } from '../../theme'
import type { ProgressProps } from './type'

const variantStyles: Record<string, string> = {
  primary: 'bg-emerald-500',
  link: 'bg-emerald-600',
  info: 'bg-sky-500',
  success: 'bg-green-500',
  warning: 'bg-amber-400',
  danger: 'bg-rose-500',
}

const sizeStyles: Record<string, string> = {
  small: 'h-1.5',
  normal: 'h-2.5',
  medium: 'h-4',
  large: 'h-6',
}

export const view = ({
  value = 0,
  max = 100,
  variant = 'primary',
  size = 'normal',
  isIndeterminate = false,
  className,
}: ProgressProps): React.ReactElement => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div
      data-component='Progress'
      className={cn(
        'w-full overflow-hidden rounded-full bg-gray-200',
        sizeStyles[size],
        className,
      )}
    >
      {isIndeterminate ? (
        <div
          className={cn(
            'h-full w-full animate-pulse rounded-full',
            variantStyles[variant] || variantStyles.primary,
          )}
        />
      ) : (
        <div
          style={{ width: `${percentage}%` }}
          className={cn(
            'h-full rounded-full transition-all duration-300',
            variantStyles[variant] || variantStyles.primary,
          )}
        />
      )}
    </div>
  )
}
