import * as RD from '@devexperts/remote-data-ts'
import type * as Pagination from '@rinn7e/tea-cup-pagination'
import * as O from 'fp-ts/lib/Option'
import * as TE from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/function'
import React from 'react'

import {
  type ApiError,
  type HttpError,
  getArticles,
  getArticlesFeed,
} from '@/common/api'
import type { Article } from '@/common/api/type/article'
import { type HomeTab, homePage } from '@/common/type/route'
import type { Shared } from '@/common/type/shared'
import type * as ArticleShort from '@/component/article-short'
import { ArticleShortComponent } from '@/component/article-short/component'
import { DotLoading } from '@/component/dot-loading'
import { ErrorMessages } from '@/component/error-messages'
import { Link } from '@/component/link'
import { renderPagination } from '@/component/pagination'

import { GET_ARTICLES_LIMIT } from './type'

export const mkPaginationConfig = (
  shared: Shared,
  tab: HomeTab,
): Pagination.Config<Article, ArticleShort.Msg, HttpError<ApiError>> => ({
  limit: GET_ARTICLES_LIMIT,
  handler: (offset, limit) => {
    switch (tab._tag) {
      case 'GlobalFeedTab':
        return pipe(
          getArticles(shared.token, { offset, limit }),
          TE.map((res) => ({
            items: res.articles,
            totalCount: res.articlesCount,
          })),
        )
      case 'UserFeedTab':
        return pipe(
          shared.token,
          O.fold(
            () =>
              TE.left<HttpError<ApiError>>({
                statusCode: 401,
                err: {
                  errors: { body: ['Not logged in'] },
                },
                actualErr: 'Not logged in',
              }),
            (token) =>
              pipe(
                getArticlesFeed(token, { offset, limit }),
                TE.map((res) => ({
                  items: res.articles,
                  totalCount: res.articlesCount,
                })),
              ),
          ),
        )
      case 'TagFeedTab':
        return pipe(
          getArticles(shared.token, { offset, limit, tag: tab.tag }),
          TE.map((res) => ({
            items: res.articles,
            totalCount: res.articlesCount,
          })),
        )
    }
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
              Your feed is empty... yet. Why not check out the{' '}
              <Link
                route={{ page: homePage() }}
                className='text-green-600 hover:underline'
              >
                Global Feed
              </Link>
              ?
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
