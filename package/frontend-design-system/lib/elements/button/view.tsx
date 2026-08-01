import { Loader2 } from 'lucide-react'
import React from 'react'

import { cn } from '../../theme'
import type { ButtonProps } from './type'

const variantStyles: Record<string, { filled: string; outlined: string }> = {
  default: {
    filled:
      'bg-white text-gray-800 border-gray-300 hover:bg-gray-50 focus:ring-gray-300',
    outlined:
      'border-gray-400 text-gray-700 hover:bg-gray-100 focus:ring-gray-300',
  },
  primary: {
    filled:
      'bg-green-600 text-white border-transparent hover:bg-green-700 focus:ring-green-500',
    outlined:
      'border-green-600 text-green-600 hover:bg-green-600 hover:text-white focus:ring-green-500',
  },
  link: {
    filled:
      'bg-transparent text-green-600 border-transparent hover:underline hover:text-green-700 focus:ring-green-500 shadow-none',
    outlined:
      'border-green-600 text-green-600 hover:bg-green-50 focus:ring-green-500',
  },
  info: {
    filled:
      'bg-sky-500 text-white border-transparent hover:bg-sky-600 focus:ring-sky-400',
    outlined:
      'border-sky-500 text-sky-500 hover:bg-sky-500 hover:text-white focus:ring-sky-400',
  },
  success: {
    filled:
      'bg-green-600 text-white border-transparent hover:bg-green-700 focus:ring-green-500',
    outlined:
      'border-green-600 text-green-600 hover:bg-green-600 hover:text-white focus:ring-green-500',
  },
  warning: {
    filled:
      'bg-amber-500 text-white border-transparent hover:bg-amber-600 focus:ring-amber-400',
    outlined:
      'border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-white focus:ring-amber-400',
  },
  danger: {
    filled:
      'bg-red-600 text-white border-transparent hover:bg-red-700 focus:ring-red-500',
    outlined:
      'border-red-600 text-red-600 hover:bg-red-600 hover:text-white focus:ring-red-500',
  },
}

const sizeStyles: Record<string, string> = {
  small: 'px-3 py-1.5 text-xs font-medium',
  normal: 'px-4 py-2 text-sm font-medium',
  medium: 'px-5 py-2.5 text-base font-medium',
  large: 'px-6 py-3 text-lg font-semibold',
}

export const view = ({
  variant = 'default',
  size = 'normal',
  isOutlined = false,
  isRounded = false,
  isFullWidth = false,
  isLoading = false,
  isDisabled = false,
  children,
  onClick,
  type = 'button',
  className,
  key,
  dataTest,
}: ButtonProps): React.ReactElement => {
  const styles = variantStyles[variant] || variantStyles.default
  const colorClass = isOutlined ? styles.outlined : styles.filled

  return (
    <button
      key={key}
      data-test={dataTest}
      data-component='Button'
      type={type}
      disabled={isDisabled || isLoading}
      onClick={onClick}
      className={cn(
        'inline-flex cursor-pointer items-center justify-center border shadow-2xs transition-all duration-150 select-none focus:ring-1 focus:ring-offset-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60',
        colorClass,
        sizeStyles[size],
        isRounded ? 'rounded-full' : 'rounded',
        isFullWidth && 'w-full',
        className,
      )}
    >
      {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
      {children()}
    </button>
  )
}
