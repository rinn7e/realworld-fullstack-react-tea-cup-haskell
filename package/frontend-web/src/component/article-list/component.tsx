import * as RD from '@devexperts/remote-data-ts'
import { EqAlways } from '@rinn7e/tea-cup-prelude'
import * as A from 'fp-ts/lib/Array'
import * as EqClass from 'fp-ts/lib/Eq'
import { pipe } from 'fp-ts/lib/function'
import * as S from 'fp-ts/lib/string'
import { memo } from 'react'

import {
  type ApiError,
  ApiErrorEq,
  type Article,
  ArticleEq,
  type HttpError,
  getHttpErrorEq,
} from '@/common/api'
import { homePage } from '@/common/type/route'
import type * as ArticleShort from '@/component/article-short'
import { ArticleShortMemo } from '@/component/article-short/component'
import { DotLoadingMemo } from '@/component/dot-loading'
import { ErrorMessagesMemo } from '@/component/error-messages/component'
import { Link } from '@/component/link'

import type { ArticleListEmptyState } from './type'

export type ArticleListProps = {
  articlesRd: RD.RemoteData<HttpError<ApiError>, Article[]>
  emptyState: ArticleListEmptyState
  itemDispatch: (item: Article, msg: ArticleShort.Msg) => void
}

const ArticleListPropsEq: EqClass.Eq<ArticleListProps> = EqClass.struct({
  articlesRd: RD.getEq(getHttpErrorEq(ApiErrorEq), A.getEq(ArticleEq)),
  emptyState: S.Eq,
  itemDispatch: EqAlways,
})

const ArticleListComponent = ({
  articlesRd,
  emptyState,
  itemDispatch,
}: ArticleListProps) =>
  pipe(
    articlesRd,
    RD.fold(
      () => (
        <div className='py-[24px]'>
          <DotLoadingMemo className='text-2xl text-green-600' />
        </div>
      ),
      () => (
        <div className='py-[24px]'>
          <DotLoadingMemo className='text-2xl text-green-600' />
        </div>
      ),
      (err) => (
        <div className='py-[24px]'>
          <ErrorMessagesMemo error={err} />
        </div>
      ),
      (articles) =>
        articles.length === 0 ? (
          <div
            className='py-[24px] text-sm text-gray-500'
            data-test='empty-feed-msg'
          >
            {emptyState === 'EmptyFeed' ? (
              <>
                Your feed is empty... yet. Why not check out the{' '}
                <Link
                  route={{ page: homePage() }}
                  className='text-green-600 hover:underline'
                >
                  Global Feed
                </Link>
                ?
              </>
            ) : (
              'No articles are here... yet.'
            )}
          </div>
        ) : (
          <div className='flex flex-col'>
            {articles.map((article) => (
              <ArticleShortMemo
                key={article.slug}
                model={article}
                dispatch={(subMsg) => itemDispatch(article, subMsg)}
              />
            ))}
          </div>
        ),
    ),
  )

export const ArticleListMemo = memo(
  ArticleListComponent,
  ArticleListPropsEq.equals,
)
