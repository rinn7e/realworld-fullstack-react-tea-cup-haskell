import React, { memo } from 'react'

import { cn } from '../../theme'
import { HeroPropsEq, type HeroProps } from './type'

const variantStyles: Record<string, string> = {
  default: 'bg-gray-100 text-gray-800',
  primary: 'bg-green-600 text-white',
  link: 'bg-sky-500 text-white',
  info: 'bg-blue-500 text-white',
  success: 'bg-emerald-500 text-white',
  warning: 'bg-amber-500 text-white',
  danger: 'bg-red-600 text-white',
}

const sizeStyles: Record<string, string> = {
  small: 'py-6 px-4',
  medium: 'py-12 px-6',
  large: 'py-24 px-8',
  fullheight: 'min-h-screen py-12 px-6 flex flex-col justify-between',
}

export const HeroComponent: React.FC<HeroProps> = ({
  variant = 'default',
  size = 'medium',
  title,
  subtitle,
  header,
  footer,
  children,
  className,
  key,
  dataTest,
}) => {
  return (
    <section
      key={key}
      data-test={dataTest}
      data-component='Hero'
      className={cn(
        'relative w-full text-center transition-colors',
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
    >
      {header && <div className='mb-4'>{header}</div>}

      <div className='mx-auto max-w-4xl'>
        {title && <h1 className='mb-2 text-4xl font-bold tracking-tight'>{title}</h1>}
        {subtitle && <p className='text-lg opacity-90'>{subtitle}</p>}
        {children?.()}
      </div>

      {footer && <div className='mt-4'>{footer}</div>}
    </section>
  )
}

export const HeroMemo = memo(HeroComponent, HeroPropsEq.equals)
