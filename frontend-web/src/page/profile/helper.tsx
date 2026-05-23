import * as RD from '@devexperts/remote-data-ts'
import type * as Pagination from '@rinn7e/tea-cup-pagination'
import * as TE from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/function'
import React from 'react'

import { type ApiError, type HttpError, getArticles } from '@/common/api'
import { type Article } from '@/common/api/type/article'
import type { Shared } from '@/common/type/shared'
import type * as ArticleShort from '@/component/article-short'
import { ArticleShortComponent } from '@/component/article-short/component'
import { DotLoading } from '@/component/dot-loading'
import { ErrorMessages } from '@/component/error-messages'
import { renderPagination } from '@/component/pagination'
import { GET_ARTICLES_LIMIT } from '@/page/home/type'

export const mkPaginationConfig = (
  shared: Shared,
  username: string,
  favorites: boolean,
): Pagination.Config<Article, ArticleShort.Msg, HttpError<ApiError>> => ({
  limit: GET_ARTICLES_LIMIT,
  handler: (offset, limit) => {
    return pipe(
      getArticles(
        shared.token,
        favorites
          ? { favorited: username, offset, limit }
          : { author: username, offset, limit },
      ),
      TE.map((res) => ({
        items: res.articles,
        totalCount: res.articlesCount,
      })),
    )
  },
  renderItems: (itemsRD, itemDispatch) => {
    return pipe(
      itemsRD,
      RD.fold(
        () => (
          <div className='py-[24px]'>
            <DotLoading className='text-2xl text-green-600' />
          </div>
        ),
        () => (
          <div className='py-[24px]'>
            <DotLoading className='text-2xl text-green-600' />
          </div>
        ),
        (err) => (
          <div className='py-[24px]'>
            <ErrorMessages error={err} />
          </div>
        ),
        (articles) =>
          articles.length === 0 ? (
            <div
              className='py-[24px] text-sm text-gray-500'
              data-test='empty-feed-msg'
            >
              No articles are here... yet.
            </div>
          ) : (
            <div className='flex flex-col'>
              {articles.map((article) => (
                <ArticleShortComponent
                  key={article.slug}
                  model={article}
                  dispatch={(subMsg) => itemDispatch(article, subMsg)}
                />
              ))}
            </div>
          ),
      ),
    )
  },
  renderPagination,
})
