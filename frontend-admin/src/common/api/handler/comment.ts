import * as TE from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/function'

import { API_BASE } from '@/common/env'

import {
  type CommentListResponse,
  CommentListResponseJson,
  type ApiError,
  type HttpError,
} from '../type'
import {
  decodeApiError,
  decodeSuccess,
  ensureIsOk,
  fetchToTaskEither,
} from './common'

export const getAdminComments = (
  token: string,
  params: {
    limit?: number
    offset?: number
    author?: string
    articleSlug?: string
  } = {},
): TE.TaskEither<HttpError<ApiError>, CommentListResponse> => {
  const query = new URLSearchParams()
  if (params.limit !== undefined) query.set('limit', String(params.limit))
  if (params.offset !== undefined) query.set('offset', String(params.offset))
  if (params.author !== undefined) query.set('author', params.author)
  if (params.articleSlug !== undefined)
    query.set('articleSlug', params.articleSlug)
  const qs = query.toString()

  return pipe(
    fetch(`${API_BASE}/admin/comments${qs ? `?${qs}` : ''}`, {
      headers: { Authorization: `Token ${token}` },
    }),
    fetchToTaskEither,
    TE.chainEitherK(decodeSuccess(CommentListResponseJson)),
    TE.mapLeft(decodeApiError),
  )
}

export const deleteComment = (
  token: string,
  id: number,
): TE.TaskEither<HttpError<ApiError>, true> =>
  pipe(
    fetch(`${API_BASE}/admin/comments/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Token ${token}` },
    }),
    fetchToTaskEither,
    TE.chainEitherK(ensureIsOk(true as const)),
    TE.mapLeft(decodeApiError),
  )
