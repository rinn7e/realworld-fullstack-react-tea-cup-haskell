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
      return submitHandler(model)
    case 'SubmitResult':
      return submitResultHandler(msg.result, model)
  }
}

const submitHandler = (model: Model): [Model, Cmd<Msg>] => {
  if (!model.email || !model.password) {
    return [
      { ...model, error: O.some('Please fill in all fields.') },
      Cmd.none(),
    ]
  }
  return [
    { ...model, isSubmitting: true, error: O.none },
    attemptTE(
      login({ user: { email: model.email, password: model.password } }),
      (result): Msg => ({ _tag: 'SubmitResult', result }),
    ),
  ]
}

const submitResultHandler = (result: any, model: Model): [Model, Cmd<Msg>] => {
  if (result.tag === 'Ok') {
    return [{ ...model, isSubmitting: false, error: O.none }, Cmd.none()]
  } else {
    const errorMsg =
      result.err.statusCode === 401 || result.err.statusCode === 403
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
