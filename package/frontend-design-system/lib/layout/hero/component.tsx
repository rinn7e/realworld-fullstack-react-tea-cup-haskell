import React, { memo } from 'react'

import { cn } from '../../theme'
import { type HeroColor, type HeroProps, HeroPropsEq } from './type'

const colorStyles: Record<HeroColor, string> = {
  white:
    'bg-white text-gray-800 border border-gray-200 dark:bg-zinc-950 dark:text-zinc-100 dark:border-zinc-800',
  green: 'bg-green-600 text-white',
  'dark-green': 'bg-green-800 text-white',
  sky: 'bg-sky-500 text-white',
  amber: 'bg-amber-500 text-white',
  red: 'bg-red-600 text-white',
  gray: 'bg-gray-100 text-gray-800 dark:bg-zinc-900 dark:text-zinc-100',
}

const sizeStyles: Record<string, string> = {
  small: 'py-6 px-4',
  medium: 'py-12 px-6',
  large: 'py-24 px-8',
  fullheight: 'min-h-screen py-12 px-6 flex flex-col justify-between',
}

export const HeroComponent: React.FC<HeroProps> = ({
  color = 'gray',
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
        colorStyles[color] || colorStyles.gray,
        sizeStyles[size],
        className,
      )}
    >
      {header && <div className='mb-4'>{header}</div>}

      <div className='mx-auto max-w-4xl'>
        {title && (
          <h1 className='mb-2 text-4xl font-bold tracking-tight'>{title}</h1>
        )}
        {subtitle && <p className='text-lg opacity-90'>{subtitle}</p>}
        {children}
      </div>

      {footer && <div className='mt-4'>{footer}</div>}
    </section>
  )
}

export const HeroMemo = memo(HeroComponent, HeroPropsEq.equals)
