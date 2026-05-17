import { cn } from '@rinn7e/tea-cup-prelude'
import React from 'react'

export interface Props {
  className?: string
}

export const IndeterminateProgressBar: React.FC<Props> = ({ className }) => {
  return (
    <div
      className={cn(
        'relative h-[2px] w-full overflow-hidden bg-green-100',
        className,
      )}
    >
      <div className='animate-indeterminate absolute h-full w-full bg-green-600' />
    </div>
  )
}
