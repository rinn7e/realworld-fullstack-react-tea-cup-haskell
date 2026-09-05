import * as RD from '@devexperts/remote-data-ts'
import * as Form from '@rinn7e/tea-cup-form'
import { attemptTE } from '@rinn7e/tea-cup-prelude'
import { Cmd, type Result } from 'tea-cup-fp'

import {
  type ApiError,
  type HttpError,
  type UserResponse,
  signup,
} from '@/common/api'
import type { Shared } from '@/common/type/shared'
import { standardInputUi } from '@/component/form-fields'

import {
  type Model,
  type Msg,
  signupEmailField,
  signupPasswordField,
  signupUsernameField,
} from './type'

const signupUsernameFormItem = (): [string, Form.FormType] => [
  signupUsernameField,
  {
    _tag: 'TextType',
    model: {
      placeholder: 'Username',
      label: 'Username',
      currentValue: '',
      validation: (s: string) => Form.nonEmptyValidator(s, 'Username'),
      linkValidations: [],
      showValidation: false,
      isTextarea: false,
      variant: { _tag: 'Text' },
      autocomplete: false,
      isFocus: false,
      ui: standardInputUi(),
    },
  },
]

const signupEmailFormItem = (): [string, Form.FormType] => [
  signupEmailField,
  {
    _tag: 'TextType',
    model: {
      placeholder: 'Email',
      label: 'Email',
      currentValue: '',
      validation: Form.emailValidator,
      linkValidations: [],
      showValidation: false,
      isTextarea: false,
      variant: { _tag: 'Email' },
      autocomplete: false,
      isFocus: false,
      ui: standardInputUi(),
    },
  },
]

const signupPasswordFormItem = (): [string, Form.FormType] => [
  signupPasswordField,
  {
    _tag: 'TextType',
    model: {
      placeholder: 'Password',
      label: 'Password',
      currentValue: '',
      validation: (s: string) => Form.minLengthValidator('Password', 8)(s),
      linkValidations: [],
      showValidation: false,
      isTextarea: false,
      variant: { _tag: 'Password', reveal: false },
      autocomplete: false,
      isFocus: false,
      ui: standardInputUi(),
    },
  },
]

const signupFormConfig = (): Form.Forms =>
  new Map([
    signupUsernameFormItem(),
    signupEmailFormItem(),
    signupPasswordFormItem(),
  ])

const preprocessFormMsgHandler =
  (newForm: Form.Model) =>
  (model: Model): Model => {
    const isFormValid =
      Form.runValidationForAll(newForm.forms, Form.noExtraValidation)._tag ===
      'Right'
    return {
      ...model,
      form: newForm,
      isFormValid,
      requestRd: RD.initial,
    }
  }

export const init = (_shared: Shared): [Model, Cmd<Msg>] => {
  const [initialForm, formCmd] = Form.init(signupFormConfig())
  const model: Model = {
    form: initialForm,
    requestRd: RD.initial,
    isFormValid: false,
  }
  return [
    preprocessFormMsgHandler(model.form)(model),
    formCmd.map((subMsg) => ({ _tag: 'FormMsg' as const, subMsg })),
  ]
}

export const update =
  (_shared: Shared) =>
  (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
    switch (msg._tag) {
      case 'FormMsg': {
        return formMsgHandler(msg.subMsg)(model)
      }
      case 'Submit': {
        return submitHandler(model)
      }
      case 'SubmitResponse': {
        return submitResponseHandler(msg.result)(model)
      }
      case 'ShowAllValidation': {
        return showAllValidationHandler(model)
      }
    }
  }

const formMsgHandler =
  (subMsg: Form.Msg) =>
  (model: Model): [Model, Cmd<Msg>] => {
    const [newForm, formCmd] = Form.update(subMsg)(model.form)
    return [
      preprocessFormMsgHandler(newForm)(model),
      formCmd.map((subMsg) => ({ _tag: 'FormMsg' as const, subMsg })),
    ]
  }

const submitHandler = (model: Model): [Model, Cmd<Msg>] => {
  const email = Form.valueTextType(
    Form.lookupForm(signupEmailField, model.form.forms),
  )
  const password = Form.valueTextType(
    Form.lookupForm(signupPasswordField, model.form.forms),
  )
  const username = Form.valueTextType(
    Form.lookupForm(signupUsernameField, model.form.forms),
  )

  return [
    { ...model, requestRd: RD.pending },
    attemptTE(
      signup({ user: { username, email, password } }),
      (result): Msg => ({ _tag: 'SubmitResponse', result }),
    ),
  ]
}

const submitResponseHandler =
  (result: Result<HttpError<ApiError>, UserResponse>) =>
  (model: Model): [Model, Cmd<Msg>] => {
    if (result.tag === 'Ok') {
      return [{ ...model, requestRd: RD.success(null) }, Cmd.none()]
    } else {
      return [{ ...model, requestRd: RD.failure(result.err) }, Cmd.none()]
    }
  }

const showAllValidationHandler = (model: Model): [Model, Cmd<Msg>] => [
  {
    ...model,
    form: {
      ...model.form,
      forms: Form.showAllValidation(model.form.forms),
    },
  },
  Cmd.none(),
]
