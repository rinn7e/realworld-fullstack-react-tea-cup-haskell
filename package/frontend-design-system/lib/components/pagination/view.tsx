import { ChevronLeft, ChevronRight } from 'lucide-react'
import React from 'react'

import { cn } from '../../theme'
import type { PaginationProps } from './type'

export const view = ({
  model,
  dispatch,
  className,
  key,
  dataTest,
}: PaginationProps): React.ReactElement => {
  const pages: number[] = []
  for (let i = 1; i <= model.totalPages; i++) {
    pages.push(i)
  }

  return (
    <nav
      key={key}
      data-test={dataTest}
      data-component='Pagination'
      aria-label='Pagination'
      className={cn('flex items-center gap-1 text-sm', className)}
    >
      <button
        type='button'
        disabled={model.currentPage <= 1}
        onClick={() =>
          dispatch({ _tag: 'SetPage', page: model.currentPage - 1 })
        }
        className='inline-flex cursor-pointer items-center justify-center rounded-md border border-gray-300 bg-white p-2 text-gray-700 shadow-2xs hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40'
      >
        <ChevronLeft className='h-4 w-4' />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          type='button'
          onClick={() => dispatch({ _tag: 'SetPage', page: p })}
          className={cn(
            'inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md font-semibold transition-colors',
            p === model.currentPage
              ? 'bg-emerald-600 text-white shadow-2xs'
              : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
          )}
        >
          {p}
        </button>
      ))}

      <button
        type='button'
        disabled={model.currentPage >= model.totalPages}
        onClick={() =>
          dispatch({ _tag: 'SetPage', page: model.currentPage + 1 })
        }
        className='inline-flex cursor-pointer items-center justify-center rounded-md border border-gray-300 bg-white p-2 text-gray-700 shadow-2xs hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40'
      >
        <ChevronRight className='h-4 w-4' />
      </button>
    </nav>
  )
}
