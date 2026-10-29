import * as RD from '@devexperts/remote-data-ts'
import type * as Pagination from '@rinn7e/tea-cup-pagination'
import { pipe } from 'fp-ts/lib/function'

import { type ApiError, type Article, type HttpError } from '@core/common/api'
import type { Shared } from '@core/common/type/shared'
import {
  type ArticleItemMsg,
  type Model,
} from '@core/screen/article-screen/type'
import { mkPaginationConfig } from '@core/screen/article-screen/util'

import {
  ListEmptyMemo,
  ListErrorMemo,
  ListLoadingMemo,
} from '@/component/list-state/component'
import { PaginationNavMemo } from '@/component/pagination-nav/component'

import { ArticleTableMemo } from './sub-component/article-table'

// The pagination of the core (`mkPaginationConfig`) with the views of the
// web
export const mkPaginationViewConfig = (
  shared: Shared,
  model: Model,
): Pagination.Config<Article, ArticleItemMsg, HttpError<ApiError>> => ({
  ...mkPaginationConfig(shared, model),
  renderItems: (itemsRd, itemDispatch) =>
    pipe(
      itemsRd,
      RD.fold(
        () => <ListLoadingMemo />,
        () => <ListLoadingMemo />,
        (error) => <ListErrorMemo entityLabel='articles' error={error} />,
        (articles) =>
          articles.length === 0 ? (
            <ListEmptyMemo entityLabel='articles' />
          ) : (
            <ArticleTableMemo articles={articles} itemDispatch={itemDispatch} />
          ),
      ),
    ),
  renderPagination: (currentPage, pageAmount, onPageChange) => (
    <PaginationNavMemo
      currentPage={currentPage}
      pageAmount={pageAmount}
      onPageChange={onPageChange}
    />
  ),
})
