import { type Option } from 'fp-ts/lib/Option'
import * as TE from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/function'

import { API_BASE } from '@/common/env'

import { type ApiError, type HttpError } from '../type/common'
import { type ProfileResponse, ProfileResponseJson } from '../type/profile'
import { decodeApiError, decodeSuccess, fetchToTaskEither } from './common'

export const getProfile = (
  token: Option<string>,
  username: string,
): TE.TaskEither<HttpError<ApiError>, ProfileResponse> =>
  pipe(
    fetch(`${API_BASE}/profiles/${encodeURIComponent(username)}`, {
      headers:
        token._tag === 'Some' ? { Authorization: `Token ${token.value}` } : {},
    }),
    fetchToTaskEither,
    TE.chainEitherK(decodeSuccess(ProfileResponseJson)),
    TE.mapLeft(decodeApiError),
  )

export const followUser = (
  token: string,
  username: string,
): TE.TaskEither<HttpError<ApiError>, ProfileResponse> =>
  pipe(
    fetch(`${API_BASE}/profiles/${encodeURIComponent(username)}/follow`, {
      method: 'POST',
      headers: { Authorization: `Token ${token}` },
    }),
    fetchToTaskEither,
    TE.chainEitherK(decodeSuccess(ProfileResponseJson)),
    TE.mapLeft(decodeApiError),
  )

export const unfollowUser = (
  token: string,
  username: string,
): TE.TaskEither<HttpError<ApiError>, ProfileResponse> =>
  pipe(
    fetch(`${API_BASE}/profiles/${encodeURIComponent(username)}/follow`, {
      method: 'DELETE',
      headers: { Authorization: `Token ${token}` },
    }),
    fetchToTaskEither,
    TE.chainEitherK(decodeSuccess(ProfileResponseJson)),
    TE.mapLeft(decodeApiError),
  )
