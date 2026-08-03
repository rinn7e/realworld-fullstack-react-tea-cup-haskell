import React, { memo } from 'react'

import { cn } from '../../theme'
import { SectionPropsEq, type SectionProps } from './type'

const sizeStyles: Record<string, string> = {
  medium: 'py-9 px-6',
  large: 'py-18 px-6',
}

export const SectionComponent: React.FC<SectionProps> = ({
  children,
  size = 'medium',
  className,
  key,
  dataTest,
}) => {
  return (
    <section
      key={key}
      data-test={dataTest}
      data-component='Section'
      className={cn('w-full', sizeStyles[size], className)}
    >
      {children}
    </section>
  )
}

export const SectionMemo = memo(SectionComponent, SectionPropsEq.equals)
