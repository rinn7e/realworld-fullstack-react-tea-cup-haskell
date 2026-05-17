import { cn } from '@rinn7e/tea-cup-prelude'
import React from 'react'

export interface Props {
  className?: string
}

export const DotLoading: React.FC<Props> = ({ className }) => {
  return (
    <span className={cn('inline-flex gap-[2px]', className)}>
      <span className='animate-flicker'>.</span>
      <span className='animate-flicker delay-200'>.</span>
      <span className='animate-flicker delay-400'>.</span>
    </span>
  )
}
