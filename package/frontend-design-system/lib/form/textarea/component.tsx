import React, { memo } from 'react'

import { cn } from '../../theme'
import { TextareaPropsEq, type TextareaProps } from './type'

export const TextareaComponent: React.FC<TextareaProps> = ({
  value,
  placeholder,
  rows = 4,
  isError,
  isDisabled,
  onChange,
  onFocus,
  onBlur,
  name,
  id,
  className,
  key,
  dataTest,
}) => {
  return (
    <textarea
      key={key}
      data-test={dataTest}
      value={value}
      placeholder={placeholder}
      rows={rows}
      disabled={isDisabled}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      name={name}
      id={id}
      className={cn(
        'w-full rounded-md border bg-white p-3 text-sm text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500/20',
        isError
          ? 'border-red-500 text-red-900 focus:border-red-500'
          : 'border-gray-300 focus:border-green-500',
        isDisabled && 'cursor-not-allowed bg-gray-100 opacity-60',
        className,
      )}
    />
  )
}

export const TextareaMemo = memo(TextareaComponent, TextareaPropsEq.equals)
