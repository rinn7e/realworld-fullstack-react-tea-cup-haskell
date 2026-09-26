export type PaginationPageItem =
  { _tag: 'Page'; page: number } | { _tag: 'Ellipsis' }

const page = (n: number): PaginationPageItem => ({ _tag: 'Page', page: n })
const ellipsis: PaginationPageItem = { _tag: 'Ellipsis' }

/**
 * Page buttons to show: every page when there are at most 7,
 * otherwise the first/last page, the pages around the current one and ellipses.
 */
export const getPaginationPageItems = (
  currentPage: number,
  pageAmount: number,
): PaginationPageItem[] => {
  if (pageAmount <= 7) {
    return Array.from({ length: pageAmount }, (_, i) => page(i + 1))
  } else if (currentPage <= 4) {
    return [...[1, 2, 3, 4, 5].map(page), ellipsis, page(pageAmount)]
  } else if (currentPage >= pageAmount - 3) {
    return [
      page(1),
      ellipsis,
      ...[4, 3, 2, 1, 0].map((offset) => page(pageAmount - offset)),
    ]
  } else {
    return [
      page(1),
      ellipsis,
      ...[currentPage - 1, currentPage, currentPage + 1].map(page),
      ellipsis,
      page(pageAmount),
    ]
  }
}
