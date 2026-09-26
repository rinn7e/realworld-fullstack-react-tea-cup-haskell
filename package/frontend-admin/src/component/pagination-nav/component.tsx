import { EqAlways, cn } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as N from 'fp-ts/lib/number'
import { memo } from 'react'

import { getPaginationPageItems } from './util'

export type PaginationNavProps = {
  currentPage: number
  pageAmount: number
  onPageChange: (page: number) => void
}

const PaginationNavPropsEq: EqClass.Eq<PaginationNavProps> = EqClass.struct({
  currentPage: N.Eq,
  pageAmount: N.Eq,
  onPageChange: EqAlways,
})

const PaginationNavComponent = ({
  currentPage,
  pageAmount,
  onPageChange,
}: PaginationNavProps) => {
  if (pageAmount <= 1) {
    return null
  } else {
    return (
      <nav className='py-[24px]' data-test='pagination-nav'>
        <ul className='flex w-fit flex-wrap overflow-hidden rounded-md border border-gray-200 bg-white/5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50'>
          {getPaginationPageItems(currentPage, pageAmount).map(
            (item, index) => {
              switch (item._tag) {
                case 'Ellipsis':
                  return (
                    <li
                      key={`ellipsis-${index}`}
                      className='border-r border-gray-200 last:border-r-0 dark:border-neutral-800'
                    >
                      <span className='flex h-[38px] min-w-[38px] items-center justify-center px-[12px] text-sm text-gray-400 dark:text-neutral-500'>
                        ...
                      </span>
                    </li>
                  )
                case 'Page':
                  return (
                    <li
                      key={item.page}
                      className='border-r border-gray-200 last:border-r-0 dark:border-neutral-800'
                      data-test='pagination-item'
                    >
                      <button
                        type='button'
                        className={cn(
                          'flex h-[38px] min-w-[38px] items-center justify-center px-[12px] text-sm font-medium transition-colors duration-200 focus:outline-none',
                          item.page === currentPage
                            ? 'bg-theme-primary text-white shadow-md'
                            : 'text-theme-primary/80 hover:bg-theme-primary/10 dark:text-neutral-300 dark:hover:bg-neutral-800',
                        )}
                        aria-current={
                          item.page === currentPage ? 'page' : undefined
                        }
                        onClick={() => onPageChange(item.page)}
                      >
                        {item.page}
                      </button>
                    </li>
                  )
              }
            },
          )}
        </ul>
      </nav>
    )
  }
}

export const PaginationNavMemo = memo(
  PaginationNavComponent,
  PaginationNavPropsEq.equals,
)
