import { memo } from 'react'
import React from 'react'

import { cn } from '../../theme'
import { type IconProps, IconPropsEq } from './type'

const sizeStyles: Record<string, string> = {
  small: 'h-4 w-4 text-xs',
  normal: 'h-5 w-5 text-sm',
  medium: 'h-6 w-6 text-base',
  large: 'h-8 w-8 text-lg',
}

export const IconComponent: React.FC<IconProps> = ({
  size = 'normal',
  children,
  className,
  key,
  dataTest,
}) => {
  return (
    <span
      key={key}
      data-test={dataTest}
      data-component='Icon'
      className={cn(
        'inline-flex items-center justify-center text-gray-600',
        sizeStyles[size],
        className,
      )}
    >
      {children()}
    </span>
  )
}

export const IconMemo = memo(IconComponent, IconPropsEq.equals)
