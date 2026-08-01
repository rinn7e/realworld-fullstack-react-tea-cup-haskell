import React from 'react'

export interface DotLoadingProps {
  className?: string
}

export const view: React.FC<DotLoadingProps> = ({ className = '' }) => {
  return (
    <span data-component='DotLoading' className={`inline-flex gap-[2px] ${className}`}>
      <span className='animate-pulse'>.</span>
      <span className='animate-pulse delay-200'>.</span>
      <span className='animate-pulse delay-400'>.</span>
    </span>
  )
}
