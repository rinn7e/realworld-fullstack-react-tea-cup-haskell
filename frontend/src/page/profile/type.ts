import * as RD from '@devexperts/remote-data-ts'
import { EqAlways } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as B from 'fp-ts/lib/boolean'
import type { Dispatcher, Result } from 'tea-cup-fp'

import {
  type ApiError,
  ApiErrorEq,
  type HttpError,
  type ProfileResponse,
  ProfileResponseEq,
  getHttpErrorEq,
} from '@/common/api'
import { type Article, ArticleEq } from '@/common/api/type/article'
import { type AppRoute, AppRouteEq } from '@/common/type/route'
import { type Shared, SharedEq } from '@/common/type/shared'
import type * as ArticleShort from '@/component/article-short'
import * as Pagination from '@rinn7e/tea-cup-pagination'

export type Model = {
  profile: RD.RemoteData<HttpError<ApiError>, ProfileResponse>
  pagination: Pagination.Model<Article, HttpError<ApiError>>
  showFavorites: boolean
  followRd: RD.RemoteData<HttpError<ApiError>, ProfileResponse>
  unfollowRd: RD.RemoteData<HttpError<ApiError>, ProfileResponse>
}

export const ModelEq = EqClass.struct<Model>({
  profile: RD.getEq(getHttpErrorEq(ApiErrorEq), ProfileResponseEq),
  pagination: Pagination.mkModelEq(ArticleEq, getHttpErrorEq(ApiErrorEq)),
  showFavorites: B.Eq,
  followRd: RD.getEq(getHttpErrorEq(ApiErrorEq), ProfileResponseEq),
  unfollowRd: RD.getEq(getHttpErrorEq(ApiErrorEq), ProfileResponseEq),
})

export type Msg =
  | {
      _tag: 'GetProfileResponse'
      result: Result<HttpError<ApiError>, ProfileResponse>
    }
  | {
      _tag: 'PaginationMsg'
      subMsg: Pagination.Msg<Article, ArticleShort.Msg, HttpError<ApiError>>
    }
  | { _tag: 'ToggleFavorites'; show: boolean }
  | { _tag: 'Follow' }
  | {
      _tag: 'FollowResponse'
      result: Result<HttpError<ApiError>, ProfileResponse>
    }
  | { _tag: 'Unfollow' }
  | {
      _tag: 'UnfollowResponse'
      result: Result<HttpError<ApiError>, ProfileResponse>
    }

export type Props = {
  model: Model
  shared: Shared
  dispatch: Dispatcher<Msg>
  isCurrentUser: boolean
  route: AppRoute
}

export const PropsEq: EqClass.Eq<Props> = EqClass.struct({
  model: ModelEq,
  shared: SharedEq,
  dispatch: EqAlways,
  isCurrentUser: B.Eq,
  route: AppRouteEq,
})
