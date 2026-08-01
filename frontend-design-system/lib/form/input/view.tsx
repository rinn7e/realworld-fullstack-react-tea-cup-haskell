import React from 'react'
import { cn } from '../../theme'
import type { InputProps } from './type'

const sizeStyles: Record<string, string> = {
  small: 'px-2.5 py-1 text-xs',
  normal: 'px-3.5 py-2 text-sm',
  medium: 'px-4 py-2.5 text-base',
  large: 'px-5 py-3 text-lg',
}

export const view: React.FC<InputProps> = ({
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
}) => {
  return (
    <input
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
        'border bg-white text-gray-900 transition-colors focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-60',
        isError
          ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
          : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-500/20',
        sizeStyles[size],
        isRounded ? 'rounded-full' : 'rounded-md',
        isFullWidth && 'w-full',
        className,
      )}
    />
  )
}
