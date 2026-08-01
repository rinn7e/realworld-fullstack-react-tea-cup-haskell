import React from 'react'

import { cn } from '../../theme'
import type { HeroProps } from './type'

const variantStyles: Record<string, string> = {
  default: 'bg-white text-gray-900 border-b border-gray-100',
  primary: 'bg-green-600 text-white',
  link: 'bg-green-700 text-white',
  info: 'bg-sky-500 text-white',
  success: 'bg-green-600 text-white',
  warning: 'bg-amber-400 text-gray-900',
  danger: 'bg-rose-600 text-white',
}

const sizeStyles: Record<string, string> = {
  small: 'py-8',
  medium: 'py-16 sm:py-24',
  large: 'py-24 sm:py-36',
  fullheight: 'min-h-screen flex flex-col justify-center py-12',
}

export const view = ({
  variant = 'default',
  size = 'medium',
  title,
  subtitle,
  children,
  header,
  footer,
  className,
}: HeroProps): React.ReactElement => {
  return (
    <section
      data-component='Hero'
      className={cn(
        'relative overflow-hidden transition-all',
        variantStyles[variant] || variantStyles.default,
        sizeStyles[size],
        className,
      )}
    >
      {header && <div className='mb-8'>{header}</div>}
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {title && (
          <h1 className='text-3xl font-extrabold tracking-tight sm:text-5xl'>
            {title}
          </h1>
        )}
        {subtitle && (
          <p className='mt-4 text-lg opacity-90 sm:text-xl'>{subtitle}</p>
        )}
        {children && <div className='mt-6'>{children()}</div>}
      </div>
      {footer && <div className='mt-8'>{footer}</div>}
    </section>
  )
}
