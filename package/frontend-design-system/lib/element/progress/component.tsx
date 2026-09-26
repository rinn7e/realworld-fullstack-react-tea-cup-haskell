import { memo } from 'react'

import { cn } from '../../theme'
import {
  type ProgressColor,
  type ProgressProps,
  ProgressPropsEq,
  type ProgressSize,
} from './type'

const colorStyles: Record<ProgressColor, string> = {
  white: 'bg-white',
  green: 'bg-green-600',
  'dark-green': 'bg-green-700',
  sky: 'bg-sky-500',
  amber: 'bg-amber-500',
  red: 'bg-red-600',
  gray: 'bg-gray-400',
}

const sizeStyles: Record<ProgressSize, string> = {
  xsmall: 'h-0.5',
  small: 'h-1.5',
  normal: 'h-2.5',
  medium: 'h-4',
  large: 'h-6',
}

const ProgressComponent = ({
  value = 0,
  max = 100,
  color = 'green',
  size = 'xsmall',
  isIndeterminate = false,
  className,
  dataTest,
}: ProgressProps) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div
      data-test={dataTest}
      data-component='Progress'
      className={cn(
        'relative w-full overflow-hidden rounded-full bg-gray-200 dark:bg-zinc-800',
        sizeStyles[size],
        className,
      )}
    >
      {isIndeterminate ? (
        <div
          className={cn(
            'animate-indeterminate absolute h-full w-full',
            colorStyles[color],
          )}
        />
      ) : (
        <div
          style={{ width: `${percentage}%` }}
          className={cn(
            'h-full rounded-full transition-all duration-300',
            colorStyles[color],
          )}
        />
      )}
    </div>
  )
}

export const ProgressMemo = memo(ProgressComponent, ProgressPropsEq.equals)
