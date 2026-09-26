import { type Option } from 'fp-ts/lib/Option'
import * as TE from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/function'

import { API_BASE } from '@/common/env'

import {
  type ApiError,
  type HttpError,
  type TrackVisitorRequest,
} from '../type'
import { decodeApiError, ensureIsOk, fetchToTaskEither } from './common'

export const trackVisitor = (
  token: Option<string>,
  body: TrackVisitorRequest,
): TE.TaskEither<HttpError<ApiError>, true> =>
  pipe(
    fetch(`${API_BASE}/visitors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token._tag === 'Some'
          ? { Authorization: `Token ${token.value}` }
          : {}),
      },
      body: JSON.stringify(body),
    }),
    fetchToTaskEither,
    TE.chainEitherK(ensureIsOk(true as const)),
    TE.mapLeft(decodeApiError),
  )
