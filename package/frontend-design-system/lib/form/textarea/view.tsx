import React from 'react'

import { cn } from '../../theme'
import type { TextareaProps } from './type'

export const view = ({
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
  key,
  dataTest,
}: TextareaProps): React.ReactElement => {
  return (
    <textarea
      key={key}
      data-test={dataTest}
      data-component='Textarea'
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
        'w-full resize-none rounded border bg-white px-3.5 py-2 text-sm text-gray-900 transition-colors outline-none focus:ring-1 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-60',
        isError
          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
          : 'border-gray-300 focus:border-green-500 focus:ring-green-500',
        className,
      )}
    />
  )
}
