import { memo } from 'react'

import { cn } from '../../theme'
import { type IconProps, IconPropsEq, type IconSize } from './type'

const sizeStyles: Record<IconSize, string> = {
  small: 'h-4 w-4 text-xs',
  normal: 'h-5 w-5 text-sm',
  medium: 'h-6 w-6 text-base',
  large: 'h-8 w-8 text-lg',
}

const IconComponent = ({
  size = 'normal',
  children,
  className,
  dataTest,
}: IconProps) => {
  return (
    <span
      data-test={dataTest}
      data-component='Icon'
      className={cn(
        'inline-flex items-center justify-center text-gray-600',
        sizeStyles[size],
        className,
      )}
    >
      {children}
    </span>
  )
}

export const IconMemo = memo(IconComponent, IconPropsEq.equals)
