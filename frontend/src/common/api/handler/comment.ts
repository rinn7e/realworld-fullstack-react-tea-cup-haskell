import { type Option } from 'fp-ts/lib/Option'
import * as TE from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/function'

import { API_BASE } from '@/common/env'

import {
  type CommentResponse,
  CommentResponseJson,
  type CommentsResponse,
  CommentsResponseJson,
} from '../type/comment'
import { type ApiError, type HttpError } from '../type/common'
import {
  decodeApiError,
  decodeSuccess,
  ensureIsOk,
  fetchToTaskEither,
} from './common'

export const getComments = (
  token: Option<string>,
  slug: string,
): TE.TaskEither<HttpError<ApiError>, CommentsResponse> =>
  pipe(
    fetch(`${API_BASE}/articles/${encodeURIComponent(slug)}/comments`, {
      headers:
        token._tag === 'Some' ? { Authorization: `Token ${token.value}` } : {},
    }),
    fetchToTaskEither,
    TE.chainEitherK(decodeSuccess(CommentsResponseJson)),
    TE.mapLeft(decodeApiError),
  )

export const createComment = (
  token: string,
  slug: string,
  body: string,
): TE.TaskEither<HttpError<ApiError>, CommentResponse> =>
  pipe(
    fetch(`${API_BASE}/articles/${encodeURIComponent(slug)}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ comment: { body } }),
    }),
    fetchToTaskEither,
    TE.chainEitherK(decodeSuccess(CommentResponseJson)),
    TE.mapLeft(decodeApiError),
  )

export const deleteComment = (
  token: string,
  slug: string,
  id: number,
): TE.TaskEither<HttpError<ApiError>, true> =>
  pipe(
    fetch(`${API_BASE}/articles/${encodeURIComponent(slug)}/comments/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Token ${token}` },
    }),
    fetchToTaskEither,
    TE.chainEitherK(ensureIsOk(true as const)),
    TE.mapLeft(decodeApiError),
  )
