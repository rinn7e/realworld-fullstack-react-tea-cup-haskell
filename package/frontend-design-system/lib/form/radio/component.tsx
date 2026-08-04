import React, { memo } from 'react'

import { cn } from '../../theme'
import { type RadioProps, RadioPropsEq } from './type'

export const RadioComponent: React.FC<RadioProps> = ({
  name,
  options,
  selectedValue,
  isDisabled,
  onChange,
  className,
  dataTest,
}) => {
  return (
    <div
      data-test={dataTest}
      data-component='Radio'
      className={cn('flex flex-col gap-2', className)}
    >
      {options.map((opt) => (
        <label
          key={opt.value}
          className={cn(
            'inline-flex items-center gap-2 text-sm text-gray-700 select-none',
            isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
          )}
        >
          <input
            type='radio'
            name={name}
            value={opt.value}
            checked={selectedValue === opt.value}
            disabled={isDisabled}
            onChange={() => onChange?.(opt.value)}
            className='h-4 w-4 border-gray-300 text-green-600 focus:ring-green-500'
          />
          {opt.label}
        </label>
      ))}
    </div>
  )
}

export const RadioMemo = memo(RadioComponent, RadioPropsEq.equals)
