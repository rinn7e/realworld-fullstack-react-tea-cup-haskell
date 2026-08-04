import React, { memo } from 'react'

import { type DotLoadingProps, DotLoadingPropsEq } from './type'

export const DotLoadingComponent: React.FC<DotLoadingProps> = ({
  className = '',
  dataTest,
}) => {
  return (
    <span
      data-test={dataTest}
      data-component='DotLoading'
      className={`inline-flex gap-[2px] ${className}`}
    >
      <span className='animate-pulse'>.</span>
      <span className='animate-pulse delay-200'>.</span>
      <span className='animate-pulse delay-400'>.</span>
    </span>
  )
}

export const DotLoadingMemo = memo(
  DotLoadingComponent,
  DotLoadingPropsEq.equals,
)
