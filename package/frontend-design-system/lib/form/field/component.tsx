import { memo } from 'react'

import { cn } from '../../theme'
import { type FieldProps, FieldPropsEq } from './type'

const FieldComponent = ({
  label,
  helpText,
  errorText,
  isExpanded,
  children,
  className,
  dataTest,
}: FieldProps) => {
  return (
    <div
      data-test={dataTest}
      data-component='Field'
      className={cn(
        'flex flex-col gap-1 pb-4 text-left',
        isExpanded && 'w-full',
        className,
      )}
    >
      {label && (
        <label className='block text-sm font-semibold text-gray-700'>
          {label}
        </label>
      )}
      {children}
      {errorText ? (
        <p className='text-xs text-red-600'>{errorText}</p>
      ) : (
        helpText && <p className='text-xs text-gray-500'>{helpText}</p>
      )}
    </div>
  )
}

export const FieldMemo = memo(FieldComponent, FieldPropsEq.equals)
