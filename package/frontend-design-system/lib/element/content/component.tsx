import { memo } from 'react'
import React from 'react'

import { cn } from '../../theme'
import { type ContentProps, ContentPropsEq } from './type'

const sizeStyles: Record<string, string> = {
  small: 'text-xs leading-relaxed',
  normal: 'text-sm leading-relaxed',
  medium: 'text-base leading-relaxed',
  large: 'text-lg leading-relaxed',
}

export const ContentComponent: React.FC<ContentProps> = ({
  size = 'normal',
  children,
  className,
  key,
  dataTest,
}) => {
  return (
    <div
      key={key}
      data-test={dataTest}
      data-component='Content'
      className={cn(
        'prose dark:prose-invert max-w-none space-y-4 text-gray-700 dark:text-zinc-200',
        sizeStyles[size],
        className,
      )}
    >
      {children}
    </div>
  )
}

export const ContentMemo = memo(ContentComponent, ContentPropsEq.equals)
