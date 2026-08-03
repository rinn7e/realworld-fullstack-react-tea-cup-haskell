import React, { memo } from 'react'

import { cn } from '../../theme'
import { SelectPropsEq, type SelectProps } from './type'

export const SelectComponent: React.FC<SelectProps> = ({
  options,
  value,
  isDisabled,
  isMultiple,
  onChange,
  name,
  className,
  key,
  dataTest,
}) => {
  return (
    <select
      key={key}
      data-test={dataTest}
      data-component='Select'
      value={value}
      disabled={isDisabled}
      multiple={isMultiple}
      onChange={onChange}
      name={name}
      className={cn(
        'w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition-colors focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20',
        isDisabled && 'cursor-not-allowed bg-gray-100 opacity-60',
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

export const SelectMemo = memo(SelectComponent, SelectPropsEq.equals)
