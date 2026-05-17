import * as RD from '@devexperts/remote-data-ts'
import { EqAlways } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as O from 'fp-ts/lib/Option'
import type { Option } from 'fp-ts/lib/Option'
import * as S from 'fp-ts/lib/string'
import type { Dispatcher, Result } from 'tea-cup-fp'

import {
  type ApiError,
  ApiErrorEq,
  type ArticleResponse,
  ArticleResponseEq,
  type HttpError,
  type ProfileResponse,
  type User,
  UserEq,
  getHttpErrorEq,
} from '@/common/api'

import * as CommentSection from './sub-component/comment-section'

export type Model = {
  slug: string
  article: RD.RemoteData<HttpError<ApiError>, ArticleResponse>
  commentSection: CommentSection.Model
}

export const ModelEq = EqClass.struct<Model>({
  slug: S.Eq,
  article: RD.getEq(getHttpErrorEq(ApiErrorEq), ArticleResponseEq),
  commentSection: CommentSection.ModelEq,
})

export type Msg =
  | {
      _tag: 'GetArticleResponse'
      result: Result<HttpError<ApiError>, ArticleResponse>
    }
  | { _tag: 'FavoriteArticle' }
  | { _tag: 'UnfavoriteArticle' }
  | {
      _tag: 'FavoriteArticleResponse'
      result: Result<HttpError<ApiError>, ArticleResponse>
    }
  | {
      _tag: 'UnfavoriteArticleResponse'
      result: Result<HttpError<ApiError>, ArticleResponse>
    }
  | { _tag: 'FollowAuthor'; username: string }
  | { _tag: 'UnfollowAuthor'; username: string }
  | {
      _tag: 'FollowAuthorResponse'
      result: Result<HttpError<ApiError>, ProfileResponse>
    }
  | {
      _tag: 'UnfollowAuthorResponse'
      result: Result<HttpError<ApiError>, ProfileResponse>
    }
  | { _tag: 'DeleteArticle' }
  | { _tag: 'DeleteArticleResponse'; result: Result<HttpError<ApiError>, true> }
  | { _tag: 'CommentSectionMsg'; subMsg: CommentSection.Msg }

export type Props = {
  model: Model
  user: Option<User>
  dispatch: Dispatcher<Msg>
}

export const PropsEq: EqClass.Eq<Props> = EqClass.struct({
  model: ModelEq,
  user: O.getEq(UserEq),
  dispatch: EqAlways,
})
