import * as RD from '@devexperts/remote-data-ts'
import * as Form from '@rinn7e/tea-cup-form'
import { attemptTE } from '@rinn7e/tea-cup-prelude'
import { Cmd } from 'tea-cup-fp'

import { login } from '@/common/api'
import type { Shared } from '@/common/type/shared'
import { standardInputUi } from '@/component/form-fields'

import {
  type Model,
  type Msg,
  loginEmailField,
  loginPasswordField,
} from './type'

const loginEmailFormItem = (): [string, Form.FormType] => [
  loginEmailField,
  {
    _tag: 'TextType',
    model: {
      placeholder: 'Email',
      label: 'Email',
      currentValue: '',
      validation: (s: string) => Form.nonEmptyValidator(s, 'Email'),
      linkValidations: [],
      showValidation: false,
      isTextarea: false,
      variant: { _tag: 'Email' },
      autocomplete: true,
      isFocus: false,
      ui: standardInputUi(),
    },
  },
]

const loginPasswordFormItem = (): [string, Form.FormType] => [
  loginPasswordField,
  {
    _tag: 'TextType',
    model: {
      placeholder: 'Password',
      label: 'Password',
      currentValue: '',
      validation: (s: string) => Form.nonEmptyValidator(s, 'Password'),
      linkValidations: [],
      showValidation: false,
      isTextarea: false,
      variant: { _tag: 'Password', reveal: false },
      autocomplete: true,
      isFocus: false,
      ui: standardInputUi(),
    },
  },
]

const loginFormConfig = (): Form.Forms =>
  new Map([loginEmailFormItem(), loginPasswordFormItem()])

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

export const formMsgHandler =
  (subMsg: Form.Msg) =>
  (model: Model): [Model, Cmd<Msg>] => {
    const [newForm, formCmd] = Form.update(subMsg)(model.form)
    return [
      preprocessFormMsgHandler(newForm)(model),
      formCmd.map((subMsg) => ({ _tag: 'FormMsg' as const, subMsg })),
    ]
  }

export const init = (_shared: Shared): [Model, Cmd<Msg>] => {
  const [initialForm, formCmd] = Form.init(loginFormConfig())
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
        const email = Form.valueTextType(
          Form.lookupForm(loginEmailField, model.form.forms),
        )
        const password = Form.valueTextType(
          Form.lookupForm(loginPasswordField, model.form.forms),
        )

        return [
          { ...model, requestRd: RD.pending },
          attemptTE(login({ user: { email, password } }), (result): Msg => ({
            _tag: 'SubmitResponse',
            result,
          })),
        ]
      }
      case 'SubmitResponse':
        if (msg.result.tag === 'Ok') {
          return [{ ...model, requestRd: RD.success(null) }, Cmd.none()]
        } else {
          return [
            { ...model, requestRd: RD.failure(msg.result.err) },
            Cmd.none(),
          ]
        }
      case 'ShowAllValidation':
        return [
          {
            ...model,
            form: {
              ...model.form,
              forms: Form.showAllValidation(model.form.forms),
            },
          },
          Cmd.none(),
        ]
    }
  }
