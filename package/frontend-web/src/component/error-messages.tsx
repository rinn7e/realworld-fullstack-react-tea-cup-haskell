import { capFirst } from '@rinn7e/tea-cup-prelude'
import * as A from 'fp-ts/lib/Array'
import { pipe } from 'fp-ts/lib/function'
import React from 'react'

import { type ApiError, type HttpError } from '@/common/api'

interface Props {
  error: HttpError<ApiError>
}

export const ErrorMessages: React.FC<Props> = ({ error }) => {
  const apiError = error.err

  const messages: string[] = pipe(apiError, (err) => {
    if (err != null) {
      return pipe(
        Object.entries(err.errors),
        A.chain(([field, errors]) =>
          pipe(
            errors,
            A.map((message) => `${capFirst(field)} ${message}.`),
          ),
        ),
      )
    }
    if (
      error.actualErr.toLowerCase().includes('failed to fetch') ||
      error.actualErr.toLowerCase().includes('networkerror')
    ) {
      return ['Unable to connect']
    }
    return [error.actualErr]
  })

  return (
    <ul
      className='flex flex-col gap-[4px] rounded border border-red-200 bg-red-50 p-[12px] text-sm text-red-700'
      data-test='be-input-error-list'
    >
      {messages.map((message, index) => (
        <li key={index}>{message}</li>
      ))}
    </ul>
  )
}
