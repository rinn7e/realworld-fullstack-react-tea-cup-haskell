import React from 'react'

import { cn } from '../../theme'
import type { SelectProps } from './type'

export const view = ({
  options,
  value,
  isDisabled = false,
  isMultiple = false,
  onChange,
  name,
  className,
}: SelectProps): React.ReactElement => {
  return (
    <select
      data-component='Select'
      name={name}
      value={value}
      disabled={isDisabled}
      multiple={isMultiple}
      onChange={onChange}
      className={cn(
        'w-full rounded-md border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100',
        className,
      )}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}
