import * as TE from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/function'

import { API_BASE } from '@/common/env'

import {
  type ApiError,
  type HttpError,
  type LoginRequest,
  type SignupRequest,
  type UpdateUserRequest,
  type UserResponse,
  UserResponseJson,
} from '../type'
import { decodeApiError, decodeSuccess, fetchToTaskEither } from './common'

export const getCurrentUser = (
  token: string,
): TE.TaskEither<HttpError<ApiError>, UserResponse> =>
  pipe(
    fetch(`${API_BASE}/user`, {
      headers: { Authorization: `Token ${token}` },
    }),
    fetchToTaskEither,
    TE.chainEitherK(decodeSuccess(UserResponseJson)),
    TE.mapLeft(decodeApiError),
  )

export const updateUser = (
  token: string,
  request: UpdateUserRequest,
): TE.TaskEither<HttpError<ApiError>, UserResponse> =>
  pipe(
    fetch(`${API_BASE}/user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(request),
    }),
    fetchToTaskEither,
    TE.chainEitherK(decodeSuccess(UserResponseJson)),
    TE.mapLeft(decodeApiError),
  )

export const login = (
  request: LoginRequest,
): TE.TaskEither<HttpError<ApiError>, UserResponse> =>
  pipe(
    fetch(`${API_BASE}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    }),
    fetchToTaskEither,
    TE.chainEitherK(decodeSuccess(UserResponseJson)),
    TE.mapLeft(decodeApiError),
  )

export const signup = (
  request: SignupRequest,
): TE.TaskEither<HttpError<ApiError>, UserResponse> =>
  pipe(
    fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    }),
    fetchToTaskEither,
    TE.chainEitherK(decodeSuccess(UserResponseJson)),
    TE.mapLeft(decodeApiError),
  )
