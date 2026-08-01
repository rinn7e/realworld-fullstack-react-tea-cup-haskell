import * as RD from '@devexperts/remote-data-ts'
import * as Pagination from '@rinn7e/tea-cup-pagination'
import { EqAlways } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import type { Dispatcher, Result } from 'tea-cup-fp'

import {
  type ApiError,
  ApiErrorEq,
  type HttpError,
  type TagsResponse,
  TagsResponseEq,
  getHttpErrorEq,
} from '@/common/api'
import { type Article, ArticleEq } from '@/common/api/type/article'
import { type HomeTab, HomeTabEq } from '@/common/type/route'
import { type Shared, SharedEq } from '@/common/type/shared'
import type * as ArticleShort from '@/component/article-short'

export const GET_ARTICLES_LIMIT = 10

export type Model = {
  pagination: Pagination.Model<Article, HttpError<ApiError>>
  tags: RD.RemoteData<HttpError<ApiError>, TagsResponse>
  tab: HomeTab
}

export const ModelEq = EqClass.struct<Model>({
  pagination: Pagination.mkModelEq(ArticleEq, getHttpErrorEq(ApiErrorEq)),
  tags: RD.getEq(getHttpErrorEq(ApiErrorEq), TagsResponseEq),
  tab: HomeTabEq,
})

export type Msg =
  | {
      _tag: 'GetTagsResponse'
      result: Result<HttpError<ApiError>, TagsResponse>
    }
  | {
      _tag: 'PaginationMsg'
      subMsg: Pagination.Msg<Article, ArticleShort.Msg, HttpError<ApiError>>
    }
  | { _tag: 'ChangeTab'; tab: HomeTab }
  | { _tag: 'NoOp' }

export type Props = {
  model: Model
  shared: Shared
  dispatch: Dispatcher<Msg>
}

export const PropsEq: EqClass.Eq<Props> = EqClass.struct({
  model: ModelEq,
  shared: SharedEq,
  dispatch: EqAlways,
})
