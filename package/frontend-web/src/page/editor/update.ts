import * as RD from '@devexperts/remote-data-ts'
import * as Form from '@rinn7e/tea-cup-form'
import {
  lookupForm,
  showAllValidation,
  valuePillTextType,
  valueTextType,
} from '@rinn7e/tea-cup-form'
import { attemptTE } from '@rinn7e/tea-cup-prelude'
import * as E from 'fp-ts/lib/Either'
import type * as O from 'fp-ts/lib/Option'
import { Cmd } from 'tea-cup-fp'

import { createArticle, getArticle, updateArticle } from '@/common/api'
import { type Shared } from '@/common/type/shared'
import { standardInputUi, textPillInputUi } from '@/component/form-fields'

import {
  type Model,
  type Msg,
  editorBodyField,
  editorDescriptionField,
  editorTagInputField,
  editorTitleField,
} from './type'

const editorTitleFormItem = (title: string): [string, Form.FormType] => [
  editorTitleField,
  {
    _tag: 'TextType',
    model: {
      placeholder: 'Article Title',
      label: 'Title',
      currentValue: title,
      validation: (s: string) => Form.nonEmptyValidator(s, 'Title'),
      linkValidations: [],
      showValidation: false,
      isTextarea: false,
      variant: { _tag: 'Text' },
      autocomplete: false,
      isFocus: false,
      ui: standardInputUi({ testId: 'article-title-input' }),
    },
  },
]

const editorDescriptionFormItem = (
  description: string,
): [string, Form.FormType] => [
  editorDescriptionField,
  {
    _tag: 'TextType',
    model: {
      placeholder: "What's this article about?",
      label: 'Description',
      currentValue: description,
      validation: (s: string) => Form.nonEmptyValidator(s, 'Description'),
      linkValidations: [],
      showValidation: false,
      isTextarea: false,
      variant: { _tag: 'Text' },
      autocomplete: false,
      isFocus: false,
      ui: standardInputUi({ isSmall: true, testId: 'article-desc-input' }),
    },
  },
]

const editorBodyFormItem = (body: string): [string, Form.FormType] => [
  editorBodyField,
  {
    _tag: 'TextType',
    model: {
      placeholder: 'Write your article (in markdown)',
      label: 'Body',
      currentValue: body,
      validation: (s: string) => Form.nonEmptyValidator(s, 'Body'),
      linkValidations: [],
      showValidation: false,
      isTextarea: true,
      variant: { _tag: 'Text' },
      autocomplete: false,
      isFocus: false,
      ui: standardInputUi({ isSmall: true, testId: 'article-body-textarea' }),
    },
  },
]

const editorTagInputFormItem = (tags: string[]): [string, Form.FormType] => [
  editorTagInputField,
  {
    _tag: 'TextPillType',
    model: {
      placeholder: 'Enter tags',
      label: 'Tags',
      allValues: tags,
      currentValue: '',
      validation: (s: string[]) => E.right(s),
      showValidation: false,
      isTextarea: false,
      autocomplete: false,
      isFocus: false,
      ui: textPillInputUi(),
    },
  },
]

const editorFormConfigForEdit = (values: {
  title: string
  description: string
  body: string
  tagList: string[]
}): Form.Forms =>
  new Map([
    editorTitleFormItem(values.title),
    editorDescriptionFormItem(values.description),
    editorBodyFormItem(values.body),
    editorTagInputFormItem(values.tagList),
  ])

const editorFormConfig = (): Form.Forms =>
  new Map([
    editorTitleFormItem(''),
    editorDescriptionFormItem(''),
    editorBodyFormItem(''),
    editorTagInputFormItem([]),
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

export const init = (
  shared: Shared,
  slug: O.Option<string>,
): [Model, Cmd<Msg>] => {
  const [initialForm, formCmd] = Form.init(editorFormConfig())
  const baseModel: Model = {
    slug: slug._tag === 'Some' ? slug.value : null,
    form: initialForm,
    requestRd: RD.initial,
    isFormValid: false,
  }

  const model = preprocessFormMsgHandler(initialForm)(baseModel)

  if (slug._tag === 'Some') {
    const token = shared.token
    return [
      { ...model, requestRd: RD.pending },
      Cmd.batch([
        formCmd.map((subMsg): Msg => ({ _tag: 'FormMsg', subMsg })),
        attemptTE(
          getArticle(token, slug.value),
          (result) => ({ _tag: 'GetArticleResponse', result }),
        ),
      ]),
    ]
  }

  return [
    model,
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
      case 'GetArticleResponse':
        if (msg.result.tag === 'Ok') {
          const a = msg.result.value.article
          const [newForm, formCmd] = Form.init(
            editorFormConfigForEdit({
              title: a.title,
              description: a.description,
              body: a.body ?? '',
              tagList: a.tagList,
            }),
          )
          return [
            preprocessFormMsgHandler(newForm)({
              ...model,
              requestRd: RD.success(null),
            }),
            formCmd.map((subMsg) => ({ _tag: 'FormMsg' as const, subMsg })),
          ]
        }
        return [{ ...model, requestRd: RD.failure(msg.result.err) }, Cmd.none()]

      case 'Submit': {
        const form = model.form
        const title = valueTextType(lookupForm(editorTitleField, form.forms))
        const description = valueTextType(
          lookupForm(editorDescriptionField, form.forms),
        )
        const body = valueTextType(lookupForm(editorBodyField, form.forms))
        const tagList = valuePillTextType(
          lookupForm(editorTagInputField, form.forms),
        )

        const request = {
          article: { title, description, body, tagList },
        }
        if (shared.token._tag === 'None') {
          return [model, Cmd.none()]
        }

        const task = model.slug
          ? updateArticle(shared.token.value, model.slug, request)
          : createArticle(shared.token.value, request)

        return [
          { ...model, requestRd: RD.pending },
          attemptTE(
            task,
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
              forms: showAllValidation(model.form.forms),
            },
          },
          Cmd.none(),
        ]
    }
  }
