import React from 'react'
import { ChevronRight } from 'lucide-react'
import { cn } from '../../theme'
import type { BreadcrumbProps } from './type'

const alignStyles: Record<string, string> = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
}

export const view = ({
  items,
  align = 'left',
  onSelect,
  className,
}: BreadcrumbProps): React.ReactElement => {
  return (
    <nav aria-label='breadcrumbs' className={className}>
      <ol
        className={cn(
          'flex items-center gap-1 text-sm text-gray-500',
          alignStyles[align],
        )}
      >
        {items.map((item, idx) => (
          <li key={idx} className='inline-flex items-center gap-1'>
            {idx > 0 && <ChevronRight className='h-4 w-4 text-gray-400' />}
            {item.isActive ? (
              <span className='font-semibold text-gray-900' aria-current='page'>
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
                className='transition-colors hover:text-emerald-600 hover:underline'
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
