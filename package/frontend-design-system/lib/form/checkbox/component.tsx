import React, { memo } from 'react'

import { cn } from '../../theme'
import { CheckboxPropsEq, type CheckboxProps } from './type'

export const CheckboxComponent: React.FC<CheckboxProps> = ({
  label,
  checked,
  isDisabled,
  onChange,
  name,
  id,
  className,
  key,
  dataTest,
}) => {
  return (
    <label
      key={key}
      data-test={dataTest}
      data-component='Checkbox'
      className={cn(
        'inline-flex items-center gap-2 text-sm text-gray-700 select-none',
        isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
        className,
      )}
    >
      <input
        type='checkbox'
        checked={checked}
        disabled={isDisabled}
        onChange={onChange}
        name={name}
        id={id}
        className='h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500'
      />
      {label}
    </label>
  )
}

export const CheckboxMemo = memo(CheckboxComponent, CheckboxPropsEq.equals)
