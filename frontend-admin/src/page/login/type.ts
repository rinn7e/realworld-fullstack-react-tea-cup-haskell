import { EqAlways } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as O from 'fp-ts/lib/Option'
import * as S from 'fp-ts/lib/string'
import { type Dispatcher, type Result } from 'tea-cup-fp'

import { type ApiError, type HttpError, type UserResponse } from '@/common/api/type'

export type Model = {
  readonly _tag: 'LoginModel'
  readonly email: string
  readonly password: string
  readonly isSubmitting: boolean
  readonly error: O.Option<string>
}

export type Msg =
  | { readonly _tag: 'ChangeEmail'; readonly value: string }
  | { readonly _tag: 'ChangePassword'; readonly value: string }
  | { readonly _tag: 'Submit' }
  | { readonly _tag: 'SubmitResult'; readonly result: Result<HttpError<ApiError>, UserResponse> }

export const ModelEq: EqClass.Eq<Model> = EqClass.struct({
  _tag: S.Eq,
  email: S.Eq,
  password: S.Eq,
  isSubmitting: EqClass.fromEquals((a, b) => a === b),
  error: O.getEq(S.Eq),
})

export type Props = {
  model: Model
  dispatch: Dispatcher<Msg>
}

export const PropsEq: EqClass.Eq<Props> = EqClass.struct({
  model: ModelEq,
  dispatch: EqAlways,
})
