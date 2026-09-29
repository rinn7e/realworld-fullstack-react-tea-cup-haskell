import * as RD from '@devexperts/remote-data-ts'
import * as Form from '@rinn7e/tea-cup-form'
import { EqAlways, NullableEq } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as B from 'fp-ts/lib/boolean'
import * as S from 'fp-ts/lib/string'
import type { Dispatcher, Result } from 'tea-cup-fp'

import {
  type ApiError,
  ApiErrorEq,
  type ArticleResponse,
  type HttpError,
  getHttpErrorEq,
} from '@/common/api'

export const editorTitleField = 'title'
export const editorDescriptionField = 'description'
export const editorBodyField = 'body'
export const editorTagInputField = 'tagInput'

export type Model = {
  slug: string | null
  form: Form.Model
  requestRd: RD.RemoteData<HttpError<ApiError>, null>
  isFormValid: boolean
}

export const ModelEq = EqClass.struct<Model>({
  slug: NullableEq(S.Eq),
  form: Form.ModelEq,
  requestRd: RD.getEq(getHttpErrorEq(ApiErrorEq), EqAlways),
  isFormValid: B.Eq,
})

export type Msg =
  | { _tag: 'FormMsg'; subMsg: Form.Msg }
  | { _tag: 'Submit' }
  | {
      _tag: 'SubmitResponse'
      result: Result<HttpError<ApiError>, ArticleResponse>
    }
  | { _tag: 'ShowAllValidation' }
  | {
      _tag: 'GetArticleResponse'
      result: Result<HttpError<ApiError>, ArticleResponse>
    }

export type Props = {
  model: Model
  dispatch: Dispatcher<Msg>
}

export const PropsEq: EqClass.Eq<Props> = EqClass.struct({
  model: ModelEq,
  dispatch: EqAlways,
})
