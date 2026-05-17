import { cn } from '@rinn7e/tea-cup-prelude'
import { pipe } from 'fp-ts/lib/function'
import React from 'react'

export const renderPagination = (
  currentPage: number,
  pageAmount: number,
  onPageChange: (page: number) => void,
) => {
  if (pageAmount <= 1) {
    return null
  }

  const pages: ReadonlyArray<number | string> = pipe(pageAmount, (amount) => {
    if (amount <= 7) {
      return Array.from({ length: amount }, (_, i) => i + 1)
    }
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', amount]
    }
    if (currentPage >= amount - 3) {
      return [1, '...', amount - 4, amount - 3, amount - 2, amount - 1, amount]
    }
    return [
      1,
      '...',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      '...',
      amount,
    ]
  })

  return (
    <nav className='my-[24px]' data-test='pagination-nav'>
      <ul className='flex w-fit flex-wrap rounded-md border border-gray-200 dark:border-neutral-800 bg-white/5 dark:bg-neutral-900/50 shadow-sm overflow-hidden'>
        {pages.map((p, index) => {
          if (p === '...') {
            return (
              <li
                key={`ellipsis-${index}`}
                className='border-r border-gray-200 dark:border-neutral-800 last:border-r-0'
              >
                <span className='flex h-[38px] min-w-[38px] items-center justify-center px-[12px] text-sm text-gray-400 dark:text-neutral-500'>
                  ...
                </span>
              </li>
            )
          }

          const pageNum = p as number
          return (
            <li
              key={pageNum}
              className='border-r border-gray-200 dark:border-neutral-800 last:border-r-0'
              data-test='pagination-item'
            >
              <button
                type='button'
                className={cn(
                  'flex h-[38px] min-w-[38px] items-center justify-center px-[12px] text-sm transition-colors duration-200 focus:outline-none font-medium',
                  pageNum === currentPage
                    ? 'bg-theme-primary text-white shadow-md'
                    : 'text-theme-primary/80 dark:text-neutral-300 hover:bg-theme-primary/10 dark:hover:bg-neutral-800',
                )}
                aria-current={pageNum === currentPage ? 'page' : undefined}
                onClick={() => onPageChange(pageNum)}
              >
                {pageNum}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
