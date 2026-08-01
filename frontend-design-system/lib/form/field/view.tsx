import React from 'react'
import { cn } from '../../theme'
import type { FieldProps } from './type'

export const view: React.FC<FieldProps> = ({
  label,
  helpText,
  errorText,
  isExpanded = false,
  children,
  className,
}) => {
  return (
    <div className={cn('mb-4 last:mb-0', isExpanded && 'w-full', className)}>
      {label && (
        <label className='mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-700'>
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
