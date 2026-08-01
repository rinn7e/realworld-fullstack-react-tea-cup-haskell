import React from 'react'
import { cn } from '../../theme'
import type { TextareaProps } from './type'

export const view: React.FC<TextareaProps> = ({
  value = '',
  placeholder,
  rows = 4,
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
    <textarea
      name={name}
      id={id}
      value={value}
      placeholder={placeholder}
      rows={rows}
      disabled={isDisabled}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      className={cn(
        'w-full rounded-md border bg-white px-3.5 py-2 text-sm text-gray-900 transition-colors focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-60',
        isError
          ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
          : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-500/20',
        className,
      )}
    />
  )
}
