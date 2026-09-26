import { EqAlways } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import type { Dispatcher, Result } from 'tea-cup-fp'

import {
  type ApiError,
  type Article,
  ArticleEq,
  type ArticleResponse,
  type HttpError,
} from '@/common/api'

export type Model = Article

export type Msg =
  | { _tag: 'Favorite' }
  | { _tag: 'Unfavorite' }
  | {
      _tag: 'FavoriteResponse'
      result: Result<HttpError<ApiError>, ArticleResponse>
    }
  | {
      _tag: 'UnfavoriteResponse'
      result: Result<HttpError<ApiError>, ArticleResponse>
    }

export type Props = {
  model: Model
  dispatch: Dispatcher<Msg>
}

export const PropsEq: EqClass.Eq<Props> = EqClass.struct({
  model: ArticleEq,
  dispatch: EqAlways,
})
