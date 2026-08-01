import React from 'react'

import { cn } from '../../theme'
import type { CheckboxProps } from './type'

export const view = ({
  label,
  checked = false,
  isDisabled = false,
  onChange,
  name,
  id,
  className,
}: CheckboxProps): React.ReactElement => {
  return (
    <label
      data-component='Checkbox'
      className={cn(
        'inline-flex items-center gap-2 text-sm font-medium text-gray-700 select-none',
        isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
        className,
      )}
    >
      <input
        type='checkbox'
        name={name}
        id={id}
        checked={checked}
        disabled={isDisabled}
        onChange={onChange}
        className='h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500'
      />
      {label && <span>{label}</span>}
    </label>
  )
}
