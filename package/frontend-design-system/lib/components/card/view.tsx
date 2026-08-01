import React from 'react'

import { cn } from '../../theme'
import type { CardProps } from './type'

export const view = ({
  header,
  image,
  children,
  footer,
  className,
}: CardProps): React.ReactElement => {
  return (
    <div
      data-component='Card'
      className={cn(
        'overflow-hidden rounded-xl border border-gray-200 bg-white text-gray-800 shadow-xs transition-all hover:shadow-md',
        className,
      )}
    >
      {header && (
        <div className='border-b border-gray-100 px-5 py-3.5 font-semibold text-gray-900'>
          {header}
        </div>
      )}
      {image && <div className='w-full overflow-hidden'>{image}</div>}
      <div className='p-5'>{children()}</div>
      {footer && (
        <div className='border-t border-gray-100 bg-gray-50/50 px-5 py-3 text-xs text-gray-500'>
          {footer}
        </div>
      )}
    </div>
  )
}
