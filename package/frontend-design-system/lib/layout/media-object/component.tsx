import React, { memo } from 'react'

import { cn } from '../../theme'
import { MediaObjectPropsEq, type MediaObjectProps } from './type'

export const MediaObjectComponent: React.FC<MediaObjectProps> = ({
  left,
  children,
  right,
  className,
  key,
  dataTest,
}) => {
  return (
    <article
      key={key}
      data-test={dataTest}
      className={cn('flex items-start gap-4', className)}
    >
      {left && <div className='shrink-0'>{left}</div>}
      <div className='min-w-0 flex-1'>{children()}</div>
      {right && <div className='shrink-0'>{right}</div>}
    </article>
  )
}

export const MediaObjectMemo = memo(MediaObjectComponent, MediaObjectPropsEq.equals)
