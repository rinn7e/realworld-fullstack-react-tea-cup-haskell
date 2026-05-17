import { attemptTE } from '@rinn7e/tea-cup-prelude'
import * as O from 'fp-ts/lib/Option'
import { Cmd } from 'tea-cup-fp'

import { login } from '@/common/api/handler/user'

import { type Model, type Msg } from './type'

export const init = (): [Model, Cmd<Msg>] => {
  return [
    {
      _tag: 'LoginModel',
      email: '',
      password: '',
      isSubmitting: false,
      error: O.none,
    },
    Cmd.none(),
  ]
}

export const update = (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
  switch (msg._tag) {
    case 'ChangeEmail':
      return [{ ...model, email: msg.value, error: O.none }, Cmd.none()]
    case 'ChangePassword':
      return [{ ...model, password: msg.value, error: O.none }, Cmd.none()]
    case 'Submit':
      if (!model.email || !model.password) {
        return [{ ...model, error: O.some('Please fill in all fields.') }, Cmd.none()]
      }
      return [
        { ...model, isSubmitting: true, error: O.none },
        attemptTE(
          login({ user: { email: model.email, password: model.password } }),
          (result): Msg => ({ _tag: 'SubmitResult', result }),
        ),
      ]
    case 'SubmitResult':
      if (msg.result.tag === 'Ok') {
        return [{ ...model, isSubmitting: false, error: O.none }, Cmd.none()]
      } else {
        const errorMsg =
          msg.result.err.statusCode === 401 || msg.result.err.statusCode === 403
            ? 'Invalid email or password.'
            : 'An unexpected error occurred. Please try again.'
        return [
          {
            ...model,
            isSubmitting: false,
            error: O.some(errorMsg),
          },
          Cmd.none(),
        ]
      }
  }
}
