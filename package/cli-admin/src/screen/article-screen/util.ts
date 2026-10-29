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
  // The list view renders the items and pages itself (`ListViewMemo`),
  // from the model
  renderItems: () => null,
  renderPagination: () => null,
})
