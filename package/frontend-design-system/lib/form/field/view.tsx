import React from 'react'

import { cn } from '../../theme'
import type { FieldProps } from './type'

export const view = ({
  label,
  helpText,
  errorText,
  isExpanded = false,
  children,
  className,
}: FieldProps): React.ReactElement => {
  return (
    <div
      data-component='Field'
      className={cn('mb-4 last:mb-0', isExpanded && 'w-full', className)}
    >
      {label && (
        <label className='mb-1.5 block text-xs font-semibold tracking-wider text-gray-700 uppercase'>
          {label}
        </label>
      )}
      <div className='relative'>{children}</div>
      {errorText ? (
        <p className='mt-1 text-xs text-rose-600'>{errorText}</p>
      ) : (
        helpText && <p className='mt-1 text-xs text-gray-500'>{helpText}</p>
      )}
    </div>
  )
}
