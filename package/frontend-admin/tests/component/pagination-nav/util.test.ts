import { describe, expect, it } from 'vitest'

import { getPaginationPageItems } from '@/component/pagination-nav/util'

// Compact rendering of the items: page numbers, '...' for ellipses
const show = (currentPage: number, pageAmount: number) =>
  getPaginationPageItems(currentPage, pageAmount).map((item) =>
    item._tag === 'Page' ? item.page : '...',
  )

describe('getPaginationPageItems', () => {
  it('lists every page when there are at most 7', () => {
    expect(show(1, 1)).toEqual([1])
    expect(show(3, 7)).toEqual([1, 2, 3, 4, 5, 6, 7])
  })

  it('shows the first 5 pages and the last one near the start', () => {
    expect(show(1, 20)).toEqual([1, 2, 3, 4, 5, '...', 20])
    expect(show(4, 20)).toEqual([1, 2, 3, 4, 5, '...', 20])
  })

  it('shows the first page and the last 5 pages near the end', () => {
    expect(show(17, 20)).toEqual([1, '...', 16, 17, 18, 19, 20])
    expect(show(20, 20)).toEqual([1, '...', 16, 17, 18, 19, 20])
  })

  it('shows the neighbours of the current page in the middle', () => {
    expect(show(5, 20)).toEqual([1, '...', 4, 5, 6, '...', 20])
    expect(show(16, 20)).toEqual([1, '...', 15, 16, 17, '...', 20])
  })
})
