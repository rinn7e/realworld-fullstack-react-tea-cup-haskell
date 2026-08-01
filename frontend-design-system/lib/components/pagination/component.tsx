import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../theme'
import type { PaginationProps } from './type'

export const view: React.FC<PaginationProps> = ({
  model,
  dispatch,
  onPageChange,
  className,
}) => {
  const { currentPage, totalPages } = model
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  const handleSelect = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      dispatch({ _tag: 'SetPage', page })
      onPageChange?.(page)
    }
  }

  return (
    <nav
      aria-label='pagination'
      className={cn('flex items-center justify-center gap-1', className)}
    >
      <button
        type='button'
        disabled={currentPage === 1}
        onClick={() => handleSelect(currentPage - 1)}
        className='inline-flex items-center justify-center rounded-md border border-gray-300 bg-white p-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40'
      >
        <ChevronLeft className='h-4 w-4' />
      </button>

      {pages.map((p) => {
        const isCurrent = p === currentPage
        return (
          <button
            key={p}
            type='button'
            onClick={() => handleSelect(p)}
            className={cn(
              'inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors border',
              isCurrent
                ? 'border-emerald-500 bg-emerald-500 font-bold text-white'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
            )}
          >
            {p}
          </button>
        )
      })}

      <button
        type='button'
        disabled={currentPage === totalPages}
        onClick={() => handleSelect(currentPage + 1)}
        className='inline-flex items-center justify-center rounded-md border border-gray-300 bg-white p-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40'
      >
        <ChevronRight className='h-4 w-4' />
      </button>
    </nav>
  )
}

export const PaginationView = view
