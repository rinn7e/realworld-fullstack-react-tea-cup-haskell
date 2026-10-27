import * as RD from '@devexperts/remote-data-ts'
import * as Pagination from '@rinn7e/tea-cup-pagination'
import { EqAlways } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as B from 'fp-ts/lib/boolean'
import * as S from 'fp-ts/lib/string'
import type { Dispatcher, Result } from 'tea-cup-fp'

import {
  type ApiError,
  ApiErrorEq,
  type Article,
  ArticleEq,
  type HttpError,
  type ProfileResponse,
  ProfileResponseEq,
  getHttpErrorEq,
} from '@/common/api'
import { type Brand } from '@/common/type/brand-wrapper'
import { type Shared, SharedEq } from '@/common/type/shared'
import type * as ArticleShort from '@/component/article-short'

// The profile shown (the destination's `username`). Owned: read it
// anywhere as a `string`, but only `update.ts` makes one (`init`); the brand
// has no value. Review: a cast to it outside `update.ts` shows another
// profile in the name of the one loaded.
declare class _CurrentUsernameBrand {
  private _currentUsernameBrand(): void
}

export type CurrentUsername = Brand<string, _CurrentUsernameBrand>

// The list shown, the favorites or the articles of the profile (the
// destination's `favorites`). Owned: read it anywhere as a `boolean`, but
// only `update.ts` makes one (`init`, and the reader switching lists); the
// brand has no value. Review: a cast to it outside `update.ts` switches the
// list without loading it.
declare class _CurrentShowFavoritesBrand {
  private _currentShowFavoritesBrand(): void
}

export type CurrentShowFavorites = Brand<boolean, _CurrentShowFavoritesBrand>

export type Model = {
  // The profile shown (the destination's `username`), set by a move only
  username: CurrentUsername
  profile: RD.RemoteData<HttpError<ApiError>, ProfileResponse>
  pagination: Pagination.Model<Article, HttpError<ApiError>>
  // Set by a move (`init`) and the reader switching lists only
  showFavorites: CurrentShowFavorites
  followRd: RD.RemoteData<HttpError<ApiError>, ProfileResponse>
  unfollowRd: RD.RemoteData<HttpError<ApiError>, ProfileResponse>
}

export const ModelEq = EqClass.struct<Model>({
  username: S.Eq,
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
}

export const PropsEq: EqClass.Eq<Props> = EqClass.struct({
  model: ModelEq,
  shared: SharedEq,
  dispatch: EqAlways,
  isCurrentUser: B.Eq,
})
