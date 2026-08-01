import React from 'react'

import { cn } from '../../theme'
import type { InputProps } from './type'

const sizeStyles: Record<string, string> = {
  small: 'px-3 py-1.5 text-xs',
  normal: 'px-3.5 py-2 text-sm',
  medium: 'px-4 py-2.5 text-base',
  large: 'px-5 py-3 text-lg',
}

export const view = ({
  type = 'text',
  value = '',
  placeholder,
  size = 'normal',
  isRounded = false,
  isFullWidth = true,
  isError = false,
  isDisabled = false,
  onChange,
  onFocus,
  onBlur,
  name,
  id,
  className,
}: InputProps): React.ReactElement => {
  return (
    <input
      data-component='Input'
      type={type}
      name={name}
      id={id}
      value={value}
      placeholder={placeholder}
      disabled={isDisabled}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      className={cn(
        'border bg-white text-gray-900 transition-colors outline-none focus:ring-1 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-60',
        isError
          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
          : 'border-gray-300 focus:border-green-500 focus:ring-green-500',
        sizeStyles[size],
        isRounded ? 'rounded-full' : 'rounded',
        isFullWidth && 'w-full',
        className,
      )}
    />
  )
}
