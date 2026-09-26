import * as EqClass from 'fp-ts/lib/Eq'
import { memo } from 'react'

import {
  type ApiError,
  ApiErrorEq,
  type HttpError,
  getHttpErrorEq,
} from '@/common/api'

import { getErrorMessages } from './util'

export type ErrorMessagesProps = {
  error: HttpError<ApiError>
}

const ErrorMessagesPropsEq: EqClass.Eq<ErrorMessagesProps> = EqClass.struct({
  error: getHttpErrorEq(ApiErrorEq),
})

const ErrorMessagesComponent = ({ error }: ErrorMessagesProps) => {
  const messages = getErrorMessages(error)

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

export const ErrorMessagesMemo = memo(
  ErrorMessagesComponent,
  ErrorMessagesPropsEq.equals,
)
