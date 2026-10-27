import * as RD from '@devexperts/remote-data-ts'
import * as Pagination from '@rinn7e/tea-cup-pagination'
import { EqAlways } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import type { Dispatcher, Result } from 'tea-cup-fp'

import {
  type ApiError,
  ApiErrorEq,
  type Article,
  ArticleEq,
  type HttpError,
  type TagsResponse,
  TagsResponseEq,
  getHttpErrorEq,
} from '@/common/api'
import { type Brand } from '@/common/type/brand-wrapper'
import { type HomeTab, HomeTabEq } from '@/common/type/destination'
import { type Shared, SharedEq } from '@/common/type/shared'
import type * as ArticleShort from '@/component/article-short'

// The feed shown (the destination's `tab`). Owned: read it anywhere as a
// `HomeTab`, but only `update.ts` makes one (`init`, and the reader
// switching tabs); the brand has no value. Review: a cast to it outside
// `update.ts` changes the tab without its feed.
declare class _CurrentHomeTabBrand {
  private _currentHomeTabBrand(): void
}

export type CurrentHomeTab = Brand<HomeTab, _CurrentHomeTabBrand>

export type Model = {
  pagination: Pagination.Model<Article, HttpError<ApiError>>
  tags: RD.RemoteData<HttpError<ApiError>, TagsResponse>
  // Set by a move (`init`) and the reader switching tabs (`ChangeTab`) only
  tab: CurrentHomeTab
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
