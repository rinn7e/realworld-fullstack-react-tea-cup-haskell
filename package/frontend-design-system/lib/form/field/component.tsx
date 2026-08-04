import React, { memo } from 'react'

import { cn } from '../../theme'
import { type FieldProps, FieldPropsEq } from './type'

export const FieldComponent: React.FC<FieldProps> = ({
  label,
  helpText,
  errorText,
  isExpanded,
  children,
  className,
  key,
  dataTest,
}) => {
  return (
    <div
      key={key}
      data-test={dataTest}
      data-component='Field'
      className={cn('mb-4 text-left', isExpanded && 'w-full', className)}
    >
      {label && (
        <label className='mb-1 block text-sm font-semibold text-gray-700'>
          {label}
        </label>
      )}
      {children}
      {errorText ? (
        <p className='mt-1 text-xs text-red-600'>{errorText}</p>
      ) : (
        helpText && <p className='mt-1 text-xs text-gray-500'>{helpText}</p>
      )}
    </div>
  )
}

export const FieldMemo = memo(FieldComponent, FieldPropsEq.equals)
