import React from 'react'

import { cn } from '../../theme'
import type { RadioProps } from './type'

export const view = ({
  name,
  options,
  selectedValue,
  isDisabled = false,
  onChange,
  className,
  key,
  dataTest,
}: RadioProps): React.ReactElement => {
  return (
    <div
      key={key}
      data-test={dataTest}
      data-component='Radio'
      className={cn('flex flex-col gap-2', className)}
    >
      {options.map((opt) => (
        <label
          key={opt.value}
          className={cn(
            'inline-flex items-center gap-2 text-sm font-medium text-gray-700 select-none',
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
            className='h-4 w-4 border-gray-300 text-emerald-600 focus:ring-emerald-500'
          />
          <span>{opt.label}</span>
        </label>
      ))}
    </div>
  )
}
