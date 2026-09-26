import { memo } from 'react'

import { cn } from '../../theme'
import { type SectionProps, SectionPropsEq, type SectionSize } from './type'

const sizeStyles: Record<SectionSize, string> = {
  medium: 'py-9 px-6',
  large: 'py-18 px-6',
}

const SectionComponent = ({
  children,
  size = 'medium',
  className,
  dataTest,
}: SectionProps) => {
  return (
    <section
      data-test={dataTest}
      data-component='Section'
      className={cn('w-full', sizeStyles[size], className)}
    >
      {children}
    </section>
  )
}

export const SectionMemo = memo(SectionComponent, SectionPropsEq.equals)
