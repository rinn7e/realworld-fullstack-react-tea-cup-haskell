import * as RD from '@devexperts/remote-data-ts'
import type * as Pagination from '@rinn7e/tea-cup-pagination'
import * as O from 'fp-ts/lib/Option'
import * as TE from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/function'

import {
  type ApiError,
  type Article,
  type HttpError,
  getAdminArticles,
} from '@/common/api'
import type { Shared } from '@/common/type/shared'
import {
  ListEmptyMemo,
  ListErrorMemo,
  ListLoadingMemo,
} from '@/component/list-state/component'
import { PaginationNavMemo } from '@/component/pagination-nav/component'

import { ArticleTableMemo } from './sub-component/article-table'
import { type ArticleItemMsg, GET_ARTICLES_LIMIT, type Model } from './type'

export const mkPaginationConfig = (
  shared: Shared,
  model: Model,
): Pagination.Config<Article, ArticleItemMsg, HttpError<ApiError>> => ({
  limit: GET_ARTICLES_LIMIT,
  scrollContainerId: 'main-content',
  handler: (offset, limit) => {
    const searchParams = {
      limit,
      offset,
      ...(model.searchBar.searchText.trim() && {
        search: model.searchBar.searchText.trim(),
      }),
      sort: model.searchBar.sort,
      direction: model.searchBar.direction,
    }

    return pipe(
      shared.token,
      O.fold(
        () =>
          TE.left<HttpError<ApiError>>({
            statusCode: 401,
            err: {
              errors: { body: ['Not authenticated'] },
            },
            actualErr: 'Not authenticated',
          }),
        (token) =>
          pipe(
            getAdminArticles(token, searchParams),
            TE.map((res) => ({
              items: res.articles,
              totalCount: res.articlesCount,
            })),
          ),
      ),
    )
  },
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
