import React from 'react'

import { cn } from '../../theme'
import type { MediaObjectProps } from './type'

export const view = ({
  left,
  children,
  right,
  className,
}: MediaObjectProps): React.ReactElement => {
  return (
    <article
      data-component='MediaObject'
      className={cn('flex items-start gap-4 text-sm', className)}
    >
      {left && <div className='shrink-0'>{left}</div>}
      <div className='min-w-0 flex-1'>{children}</div>
      {right && <div className='shrink-0'>{right}</div>}
    </article>
  )
}
