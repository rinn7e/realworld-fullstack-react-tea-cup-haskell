import { PaginationNavMemo } from '@/component/pagination-nav/component'

import { ArticleListMemo } from './component'
import type { ArticleListEmptyState, ArticlePaginationConfig } from './type'

export const ARTICLE_PAGE_LIMIT = 10

export const mkArticlePaginationConfig = (
  handler: ArticlePaginationConfig['handler'],
  emptyState: ArticleListEmptyState,
): ArticlePaginationConfig => ({
  limit: ARTICLE_PAGE_LIMIT,
  handler,
  renderItems: (articlesRd, itemDispatch) => (
    <ArticleListMemo
      articlesRd={articlesRd}
      emptyState={emptyState}
      itemDispatch={itemDispatch}
    />
  ),
  renderPagination: (currentPage, pageAmount, onPageChange) => (
    <PaginationNavMemo
      currentPage={currentPage}
      pageAmount={pageAmount}
      onPageChange={onPageChange}
    />
  ),
})
