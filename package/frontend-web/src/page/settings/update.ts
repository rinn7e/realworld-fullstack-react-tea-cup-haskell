import * as RD from '@devexperts/remote-data-ts'
import * as Form from '@rinn7e/tea-cup-form'
import { lookupForm, valueTextType } from '@rinn7e/tea-cup-form'
import { attemptTE } from '@rinn7e/tea-cup-prelude'
import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'
import { Cmd } from 'tea-cup-fp'

import { type User, updateUser } from '@/common/api'
import { type Shared } from '@/common/type/shared'
import { minLengthIfExistValidator } from '@/common/util'
import { standardInputUi } from '@/component/form-fields'

import {
  type Model,
  type Msg,
  settingsBioField,
  settingsEmailField,
  settingsImageField,
  settingsPasswordConfirmationField,
  settingsPasswordField,
  settingsUsernameField,
} from './type'

const settingsImageFormItem = (
  image: string | null,
): [string, Form.FormType] => [
  settingsImageField,
  {
    _tag: 'TextType',
    model: {
      placeholder: 'URL of profile picture',
      label: 'Profile picture',
      currentValue: image || '',
      validation: E.right,
      linkValidations: [],
      showValidation: false,
      isTextarea: false,
      variant: { _tag: 'Text' },
      autocomplete: false,
      isFocus: false,
      ui: standardInputUi({ isSmall: true, testId: 'user-image-input' }),
    },
  },
]

const settingsUsernameFormItem = (
  username: string,
): [string, Form.FormType] => [
  settingsUsernameField,
  {
    _tag: 'TextType',
    model: {
      placeholder: 'Username',
      label: 'Username',
      currentValue: username,
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

const settingsBioFormItem = (bio: string | null): [string, Form.FormType] => [
  settingsBioField,
  {
    _tag: 'TextType',
    model: {
      placeholder: 'Short bio about you',
      label: 'Bio',
      currentValue: bio || '',
      validation: E.right,
      linkValidations: [],
      showValidation: false,
      isTextarea: true,
      variant: { _tag: 'Text' },
      autocomplete: false,
      isFocus: false,
      ui: standardInputUi({ testId: 'user-bio-textarea' }),
    },
  },
]

const settingsEmailFormItem = (email: string): [string, Form.FormType] => [
  settingsEmailField,
  {
    _tag: 'TextType',
    model: {
      placeholder: 'Email',
      label: 'Email',
      currentValue: email,
      validation: (s: string) =>
        pipe(Form.nonEmptyValidator(s, 'Email'), E.chain(Form.emailValidator)),
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

const settingsPasswordFormItem = (): [string, Form.FormType] => [
  settingsPasswordField,
  {
    _tag: 'TextType',
    model: {
      placeholder: 'New Password',
      label: 'Password',
      currentValue: '',
      validation: (s: string) => minLengthIfExistValidator('Password', 8)(s),
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

const settingsPasswordConfirmationFormItem = (): [string, Form.FormType] => [
  settingsPasswordConfirmationField,
  {
    _tag: 'TextType',
    model: {
      placeholder: 'Repeat Password',
      label: 'Repeat Password',
      currentValue: '',
      validation: (s: string) =>
        minLengthIfExistValidator('Repeat Password', 8)(s),
      linkValidations: [
        {
          linkKey: settingsPasswordField,
          validation: (currentInput: string, linkInput: string) => {
            if (currentInput !== linkInput) {
              return E.left('Password does not match')
            }
            return E.right(currentInput)
          },
        },
      ],
      showValidation: false,
      isTextarea: false,
      variant: { _tag: 'Password', reveal: false },
      autocomplete: false,
      isFocus: false,
      ui: standardInputUi(),
    },
  },
]

const settingsFormConfig = (user: User): Form.Forms =>
  new Map([
    settingsImageFormItem(user.image),
    settingsUsernameFormItem(user.username),
    settingsBioFormItem(user.bio),
    settingsEmailFormItem(user.email),
    settingsPasswordFormItem(),
    settingsPasswordConfirmationFormItem(),
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

export const formMsgHandler =
  (subMsg: Form.Msg) =>
  (model: Model): [Model, Cmd<Msg>] => {
    const [newForm, formCmd] = Form.update(subMsg)(model.form)
    return [
      preprocessFormMsgHandler(newForm)(model),
      formCmd.map((subMsg) => ({ _tag: 'FormMsg' as const, subMsg })),
    ]
  }

export const init = (user: User): [Model, Cmd<Msg>] => {
  const [initialForm, formCmd] = Form.init(settingsFormConfig(user))
  const baseModel: Model = {
    form: initialForm,
    requestRd: RD.initial,
    isFormValid: false,
  }
  return [
    preprocessFormMsgHandler(initialForm)(baseModel),
    formCmd.map((subMsg) => ({ _tag: 'FormMsg' as const, subMsg })),
  ]
}

export const update =
  (shared: Shared) =>
  (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
    switch (msg._tag) {
      case 'FormMsg': {
        return formMsgHandler(msg.subMsg)(model)
      }
      case 'Logout':
        return [model, Cmd.none()]
      case 'Submit': {
        const form = model.form
        const image = valueTextType(lookupForm(settingsImageField, form.forms))
        const username = valueTextType(
          lookupForm(settingsUsernameField, form.forms),
        )
        const bio = valueTextType(lookupForm(settingsBioField, form.forms))
        const email = valueTextType(lookupForm(settingsEmailField, form.forms))
        const password = valueTextType(
          lookupForm(settingsPasswordField, form.forms),
        )

        const userUpdate: {
          image?: string
          username?: string
          bio?: string
          email?: string
          password?: string
        } = { image, username, bio, email }
        if (password) {
          userUpdate.password = password
        }

        if (shared.token._tag === 'None') {
          return [model, Cmd.none()]
        }

        return [
          { ...model, requestRd: RD.pending },
          attemptTE(
            updateUser(shared.token.value, { user: userUpdate }),
            (result): Msg => ({ _tag: 'SubmitResponse', result }),
          ),
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
