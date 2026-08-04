import { ChevronRight } from 'lucide-react'
import React, { memo } from 'react'

import { cn } from '../../theme'
import type { BreadcrumbProps } from './type'
import { BreadcrumbPropsEq } from './type'

const alignStyles: Record<string, string> = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
}

export const BreadcrumbComponent = ({
  items,
  align = 'left',
  onSelect,
  className,
  dataTest,
}: BreadcrumbProps): React.ReactElement => {
  return (
    <nav
      data-test={dataTest}
      data-component='Breadcrumb'
      aria-label='breadcrumbs'
      className={className}
    >
      <ol
        className={cn(
          'flex items-center gap-1 text-sm text-gray-500 dark:text-zinc-400',
          alignStyles[align],
        )}
      >
        {items.map((item, idx) => (
          <li key={idx} className='inline-flex items-center gap-1'>
            {idx > 0 && (
              <ChevronRight className='h-4 w-4 text-gray-400 dark:text-zinc-600' />
            )}
            {item.isActive ? (
              <span
                className='font-semibold text-gray-900 dark:text-zinc-100'
                aria-current='page'
              >
                {item.label}
              </span>
            ) : (
              <a
                href={item.href || '#'}
                onClick={(e) => {
                  if (onSelect) {
                    e.preventDefault()
                    onSelect(item)
                  }
                }}
                className='cursor-pointer transition-colors hover:text-emerald-600 hover:underline dark:hover:text-emerald-400'
              >
                {item.label}
              </a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export const BreadcrumbMemo = memo(
  BreadcrumbComponent,
  BreadcrumbPropsEq.equals,
)
