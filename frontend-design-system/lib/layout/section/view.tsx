import React from 'react'
import { cn } from '../../theme'
import type { SectionProps } from './type'

const sizeStyles: Record<string, string> = {
  small: 'py-6',
  medium: 'py-12 sm:py-16',
  large: 'py-20 sm:py-28',
}

export const view: React.FC<SectionProps> = ({
  size = 'medium',
  children,
  className,
}) => {
  return (
    <section className={cn('w-full', sizeStyles[size], className)}>
      {children}
    </section>
  )
}
