import { capFirst } from '@rinn7e/tea-cup-prelude'
import * as A from 'fp-ts/lib/Array'
import { pipe } from 'fp-ts/lib/function'

import type { ApiError, HttpError } from '@/common/api'

/**
 * Field errors become "Field message." lines; a missing API body falls back to
 * the raw error, with network failures shown as "Unable to connect".
 */
export const getErrorMessages = (error: HttpError<ApiError>): string[] => {
  if (error.err !== null) {
    return pipe(
      Object.entries(error.err.errors),
      A.chain(([field, errors]) =>
        pipe(
          errors,
          A.map((message) => `${capFirst(field)} ${message}.`),
        ),
      ),
    )
  } else if (
    error.actualErr.toLowerCase().includes('failed to fetch') ||
    error.actualErr.toLowerCase().includes('networkerror')
  ) {
    return ['Unable to connect']
  } else {
    return [error.actualErr]
  }
}
