import { Loader2 } from 'lucide-react'
import React from 'react'

import { cn } from '../../theme'
import type { ButtonColor, ButtonProps, ButtonVariant } from './type'

const colorStyles: Record<ButtonColor, Record<ButtonVariant, string>> = {
  white: {
    solid:
      'bg-white text-gray-800 border-gray-300 hover:bg-gray-50 focus:ring-gray-300',
    outline:
      'bg-transparent border-gray-400 text-gray-700 hover:border-gray-600 hover:text-gray-900 hover:bg-transparent focus:ring-gray-300',
    link: 'bg-transparent text-gray-800 border-transparent hover:underline hover:text-gray-900 focus:ring-gray-300 shadow-none',
  },
  green: {
    solid:
      'bg-green-600 text-white border-transparent hover:bg-green-700 focus:ring-green-500',
    outline:
      'bg-transparent border-green-600 text-green-600 hover:border-green-700 hover:text-green-700 hover:bg-transparent focus:ring-green-500',
    link: 'bg-transparent text-green-600 border-transparent hover:underline hover:text-green-700 focus:ring-green-500 shadow-none',
  },
  'dark-green': {
    solid:
      'bg-green-800 text-white border-transparent hover:bg-green-900 focus:ring-green-700',
    outline:
      'bg-transparent border-green-800 text-green-800 hover:border-green-900 hover:text-green-900 hover:bg-transparent focus:ring-green-700',
    link: 'bg-transparent text-green-800 border-transparent hover:underline hover:text-green-900 focus:ring-green-700 shadow-none',
  },
  sky: {
    solid:
      'bg-sky-500 text-white border-transparent hover:bg-sky-600 focus:ring-sky-400',
    outline:
      'bg-transparent border-sky-500 text-sky-500 hover:border-sky-600 hover:text-sky-600 hover:bg-transparent focus:ring-sky-400',
    link: 'bg-transparent text-sky-500 border-transparent hover:underline hover:text-sky-600 focus:ring-sky-400 shadow-none',
  },
  amber: {
    solid:
      'bg-amber-500 text-white border-transparent hover:bg-amber-600 focus:ring-amber-400',
    outline:
      'bg-transparent border-amber-500 text-amber-600 hover:border-amber-600 hover:text-amber-700 hover:bg-transparent focus:ring-amber-400',
    link: 'bg-transparent text-amber-500 border-transparent hover:underline hover:text-amber-600 focus:ring-amber-400 shadow-none',
  },
  red: {
    solid:
      'bg-red-600 text-white border-transparent hover:bg-red-700 focus:ring-red-500',
    outline:
      'bg-transparent border-red-600 text-red-600 hover:border-red-700 hover:text-red-700 hover:bg-transparent focus:ring-red-500',
    link: 'bg-transparent text-red-600 border-transparent hover:underline hover:text-red-700 focus:ring-red-500 shadow-none',
  },
}

const sizeStyles: Record<string, string> = {
  xsmall: 'px-2 py-1 text-xs font-medium',
  small: 'px-3 py-1.5 text-xs font-medium',
  normal: 'px-4 py-2 text-sm font-medium',
  medium: 'px-5 py-2.5 text-base font-medium',
  large: 'px-6 py-3 text-lg font-semibold',
}

export const view = ({
  color = 'green',
  variant = 'solid',
  size = 'normal',
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
  const styles = colorStyles[color] || colorStyles.green
  const colorClass = styles[variant] || styles.solid

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
