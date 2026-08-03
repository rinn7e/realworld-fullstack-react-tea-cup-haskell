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
    link: 'bg-transparent text-gray-800 border-transparent hover:underline hover:text-gray-900 focus:ring-gray-300',
    ghost:
      'bg-transparent border-transparent text-white hover:text-gray-200 focus:ring-gray-300',
  },
  green: {
    solid:
      'bg-green-600 text-white border-transparent hover:bg-green-700 focus:ring-green-500',
    outline:
      'bg-transparent border-green-600 text-green-600 hover:border-green-700 hover:text-green-700 hover:bg-transparent focus:ring-green-500',
    link: 'bg-transparent text-green-600 border-transparent hover:underline hover:text-green-700 focus:ring-green-500',
    ghost:
      'bg-transparent border-transparent text-green-600 hover:text-green-700 focus:ring-green-500',
  },
  'dark-green': {
    solid:
      'bg-green-800 text-white border-transparent hover:bg-green-900 focus:ring-green-700',
    outline:
      'bg-transparent border-green-800 text-green-800 hover:border-green-900 hover:text-green-900 hover:bg-transparent focus:ring-green-700',
    link: 'bg-transparent text-green-800 border-transparent hover:underline hover:text-green-900 focus:ring-green-700',
    ghost:
      'bg-transparent border-transparent text-green-800 hover:text-green-900 focus:ring-green-700',
  },
  sky: {
    solid:
      'bg-sky-500 text-white border-transparent hover:bg-sky-600 focus:ring-sky-400',
    outline:
      'bg-transparent border-sky-500 text-sky-500 hover:border-sky-600 hover:text-sky-600 hover:bg-transparent focus:ring-sky-400',
    link: 'bg-transparent text-sky-500 border-transparent hover:underline hover:text-sky-600 focus:ring-sky-400',
    ghost:
      'bg-transparent border-transparent text-sky-500 hover:text-sky-600 focus:ring-sky-400',
  },
  amber: {
    solid:
      'bg-amber-500 text-white border-transparent hover:bg-amber-600 focus:ring-amber-400',
    outline:
      'bg-transparent border-amber-500 text-amber-600 hover:border-amber-600 hover:text-amber-700 hover:bg-transparent focus:ring-amber-400',
    link: 'bg-transparent text-amber-500 border-transparent hover:underline hover:text-amber-600 focus:ring-amber-400',
    ghost:
      'bg-transparent border-transparent text-amber-500 hover:text-amber-600 focus:ring-amber-400',
  },
  red: {
    solid:
      'bg-red-600 text-white border-transparent hover:bg-red-700 focus:ring-red-500',
    outline:
      'bg-transparent border-red-400 text-red-500 hover:border-red-500 hover:text-red-600 hover:bg-transparent focus:ring-red-400',
    link: 'bg-transparent text-red-600 border-transparent hover:underline hover:text-red-700 focus:ring-red-500',
    ghost:
      'bg-transparent border-transparent text-red-500 hover:text-red-600 focus:ring-red-400',
  },
  gray: {
    solid:
      'bg-gray-200 text-gray-700 border-transparent hover:bg-gray-300 focus:ring-gray-300',
    outline:
      'bg-transparent border-gray-400 text-gray-600 hover:border-gray-600 hover:text-gray-800 hover:bg-transparent focus:ring-gray-300',
    link: 'bg-transparent text-gray-600 border-transparent hover:underline hover:text-gray-800 focus:ring-gray-300',
    ghost:
      'bg-transparent border-transparent text-gray-500 hover:text-gray-700 focus:ring-gray-300',
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
        'relative inline-flex cursor-pointer items-center justify-center border transition-all duration-150 select-none focus:ring-1 focus:ring-offset-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60',
        colorClass,
        sizeStyles[size],
        isRounded ? 'rounded-full' : 'rounded',
        isFullWidth && 'w-full',
        className,
      )}
    >
      {isLoading ? (
        <>
          <span className='opacity-0'>{children()}</span>
          <div className='absolute inset-0 flex items-center justify-center'>
            <Loader2 className='h-4 w-4 animate-spin' />
          </div>
        </>
      ) : (
        children()
      )}
    </button>
  )
}
