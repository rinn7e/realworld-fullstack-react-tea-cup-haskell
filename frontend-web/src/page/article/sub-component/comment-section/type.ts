import * as RD from '@devexperts/remote-data-ts'
import { EqAlways, NullableEq } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as O from 'fp-ts/lib/Option'
import type { Option } from 'fp-ts/lib/Option'
import * as S from 'fp-ts/lib/string'
import type { Dispatcher, Result } from 'tea-cup-fp'

import {
  type ApiError,
  ApiErrorEq,
  type CommentResponse,
  type CommentsResponse,
  CommentsResponseEq,
  type HttpError,
  type User,
  UserEq,
  getHttpErrorEq,
} from '@/common/api'

export type Model = {
  comments: RD.RemoteData<HttpError<ApiError>, CommentsResponse>
  newCommentInput: string
  newCommentError: HttpError<ApiError> | null
}

export const ModelEq = EqClass.struct<Model>({
  comments: RD.getEq(getHttpErrorEq(ApiErrorEq), CommentsResponseEq),
  newCommentInput: S.Eq,
  newCommentError: NullableEq(getHttpErrorEq(ApiErrorEq)),
})

export type Msg =
  | {
      _tag: 'GetCommentsResponse'
      result: Result<HttpError<ApiError>, CommentsResponse>
    }
  | { _tag: 'SetCommentInput'; value: string }
  | { _tag: 'SubmitComment' }
  | {
      _tag: 'SubmitCommentResponse'
      result: Result<HttpError<ApiError>, CommentResponse>
    }
  | { _tag: 'DeleteComment'; id: number }
  | {
      _tag: 'DeleteCommentResponse'
      id: number
      result: Result<HttpError<ApiError>, true>
    }

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
