import * as RD from '@devexperts/remote-data-ts'
import * as Form from '@rinn7e/tea-cup-form'
import { EqAlways } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as B from 'fp-ts/lib/boolean'
import type { Dispatcher, Result } from 'tea-cup-fp'

import {
  type ApiError,
  ApiErrorEq,
  type HttpError,
  type UserResponse,
  getHttpErrorEq,
} from '@/common/api'

export const signupUsernameField = 'username'
export const signupEmailField = 'email'
export const signupPasswordField = 'password'

export type Model = {
  form: Form.Model
  requestRd: RD.RemoteData<HttpError<ApiError>, null>
  isFormValid: boolean
}

export const ModelEq = EqClass.struct<Model>({
  form: Form.ModelEq,
  requestRd: RD.getEq(getHttpErrorEq(ApiErrorEq), EqAlways),
  isFormValid: B.Eq,
})

export type Msg =
  | { _tag: 'FormMsg'; subMsg: Form.Msg }
  | { _tag: 'Submit' }
  | {
      _tag: 'SubmitResponse'
      result: Result<HttpError<ApiError>, UserResponse>
    }
  | { _tag: 'ShowAllValidation' }

export type Props = {
  model: Model
  dispatch: Dispatcher<Msg>
}

export const PropsEq: EqClass.Eq<Props> = EqClass.struct({
  model: ModelEq,
  dispatch: EqAlways,
})
