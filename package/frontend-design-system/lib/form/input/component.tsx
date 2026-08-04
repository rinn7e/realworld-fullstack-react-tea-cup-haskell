import React, { memo } from 'react'

import { cn } from '../../theme'
import { type InputProps, InputPropsEq } from './type'

const sizeStyles: Record<string, string> = {
  small: 'px-2.5 py-1 text-xs',
  normal: 'px-3 py-1.5 text-sm',
  medium: 'px-4 py-2 text-base',
  large: 'px-5 py-3 text-lg',
}

export const InputComponent: React.FC<InputProps> = ({
  type = 'text',
  value,
  placeholder,
  size = 'normal',
  isRounded,
  isFullWidth,
  isError,
  isDisabled,
  onChange,
  onFocus,
  onBlur,
  name,
  id,
  className,
  dataTest,
}) => {
  return (
    <input
      data-test={dataTest}
      data-component='Input'
      type={type}
      value={value}
      placeholder={placeholder}
      disabled={isDisabled}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      name={name}
      id={id}
      className={cn(
        'border bg-white transition-colors focus:ring-2 focus:ring-green-500/20 focus:outline-none dark:bg-slate-900',
        sizeStyles[size],
        isRounded ? 'rounded-full' : 'rounded-md',
        isFullWidth ? 'w-full' : 'w-auto',
        isError
          ? 'border-red-500 text-red-900 focus:border-red-500 dark:text-red-400'
          : 'border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-green-500 dark:border-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-green-500',
        isDisabled &&
          'cursor-not-allowed bg-gray-100 opacity-60 dark:bg-slate-800',
        className,
      )}
    />
  )
}

export const InputMemo = memo(InputComponent, InputPropsEq.equals)
