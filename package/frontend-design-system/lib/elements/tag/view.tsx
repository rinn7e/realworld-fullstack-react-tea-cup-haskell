import React from 'react'

import { cn } from '../../theme'
import { view as DeleteView } from '../delete/view'
import type { TagProps } from './type'

const variantStyles: Record<
  string,
  { solid: string; light: string; outline: string }
> = {
  default: {
    solid: 'bg-gray-400 text-white',
    light: 'bg-gray-100 text-gray-700',
    outline: 'border border-gray-300 bg-transparent text-gray-400',
  },
  primary: {
    solid: 'bg-green-600 text-white',
    light: 'bg-green-50 text-green-700',
    outline: 'border border-green-600 bg-transparent text-green-600',
  },
  link: {
    solid: 'bg-green-700 text-white',
    light: 'bg-green-50 text-green-800',
    outline: 'border border-green-700 bg-transparent text-green-700',
  },
  info: {
    solid: 'bg-sky-500 text-white',
    light: 'bg-sky-50 text-sky-700',
    outline: 'border border-sky-500 bg-transparent text-sky-600',
  },
  success: {
    solid: 'bg-green-600 text-white',
    light: 'bg-green-50 text-green-700',
    outline: 'border border-green-600 bg-transparent text-green-600',
  },
  warning: {
    solid: 'bg-amber-400 text-gray-900',
    light: 'bg-amber-50 text-amber-800',
    outline: 'border border-amber-400 bg-transparent text-amber-700',
  },
  danger: {
    solid: 'bg-red-600 text-white',
    light: 'bg-red-50 text-red-700',
    outline: 'border border-red-600 bg-transparent text-red-600',
  },
}

const sizeStyles: Record<string, string> = {
  small: 'px-2 py-0.5 text-[11px]',
  normal: 'px-2.5 py-0.5 text-xs font-semibold',
  medium: 'px-3 py-1 text-sm font-semibold',
  large: 'px-3.5 py-1.5 text-base font-semibold',
}

export const view = ({
  variant = 'default',
  size = 'normal',
  isRounded = true,
  isLight = false,
  isOutline = false,
  children,
  onDelete,
  key,
  dataTest,
  className,
}: TagProps): React.ReactElement => {
  const v = variantStyles[variant] || variantStyles.default
  const styleClass = isOutline ? v.outline : isLight ? v.light : v.solid

  return (
    <span
      key={key}
      data-component='Tag'
      data-test={dataTest}
      className={cn(
        'inline-flex items-center gap-1.5 align-middle transition-all',
        styleClass,
        sizeStyles[size],
        isRounded ? 'rounded-full' : 'rounded',
        className,
      )}
    >
      <span>{children?.()}</span>
      {onDelete && DeleteView({ size: 'small', onClick: onDelete })}
    </span>
  )
}
