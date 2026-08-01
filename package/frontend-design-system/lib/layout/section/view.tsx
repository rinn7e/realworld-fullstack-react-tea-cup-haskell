import React from 'react'

import { cn } from '../../theme'
import type { SectionProps } from './type'

const sizeStyles: Record<string, string> = {
  small: 'py-6',
  medium: 'py-12 sm:py-16',
  large: 'py-20 sm:py-28',
}

export const view = ({
  size = 'medium',
  children,
  className,
  key,
  dataTest,
}: SectionProps): React.ReactElement => {
  return (
    <section
      key={key}
      data-test={dataTest}
      data-component='Section'
      className={cn('w-full', sizeStyles[size], className)}
    >
      {children()}
    </section>
  )
}
