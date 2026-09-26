import { memo } from 'react'

import { cn } from '../../theme'
import { type ContentProps, ContentPropsEq, type ContentSize } from './type'

const sizeStyles: Record<ContentSize, string> = {
  small: 'text-xs leading-relaxed',
  normal: 'text-sm leading-relaxed',
  medium: 'text-base leading-relaxed',
  large: 'text-lg leading-relaxed',
}

const ContentComponent = ({
  size = 'normal',
  children,
  className,
  dataTest,
}: ContentProps) => {
  return (
    <div
      data-test={dataTest}
      data-component='Content'
      className={cn(
        'prose dark:prose-invert flex max-w-none flex-col gap-4 text-gray-700 dark:text-zinc-200',
        sizeStyles[size],
        className,
      )}
    >
      {children}
    </div>
  )
}

export const ContentMemo = memo(ContentComponent, ContentPropsEq.equals)
