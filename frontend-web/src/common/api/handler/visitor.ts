import { type Option } from 'fp-ts/lib/Option'
import * as TE from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/function'

import { API_BASE } from '@/common/env'

import { type ApiError, type HttpError } from '../type/common'
import {
  type TrackVisitorRequest,
  type VisitorResponse,
  VisitorResponseJson,
} from '../type/visitor'
import { decodeApiError, decodeSuccess, fetchToTaskEither } from './common'

export const trackVisitor = (
  token: Option<string>,
  body: TrackVisitorRequest,
): TE.TaskEither<HttpError<ApiError>, VisitorResponse> =>
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
    TE.chainEitherK(decodeSuccess(VisitorResponseJson)),
    TE.mapLeft(decodeApiError),
  )
