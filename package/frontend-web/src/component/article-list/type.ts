import type * as Pagination from '@rinn7e/tea-cup-pagination'

import type { ApiError, Article, HttpError } from '@/common/api'
import type * as ArticleShort from '@/component/article-short'

export type ArticlePaginationConfig = Pagination.Config<
  Article,
  ArticleShort.Msg,
  HttpError<ApiError>
>

/**
 * `EmptyFeed` points the user to the global feed,
 * `EmptyArticles` just says there is nothing yet.
 */
export type ArticleListEmptyState = 'EmptyFeed' | 'EmptyArticles'
