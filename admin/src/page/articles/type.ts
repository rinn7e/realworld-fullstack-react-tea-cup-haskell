import * as Pagination from '@rinn7e/tea-cup-pagination'
import { EqAlways } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as O from 'fp-ts/lib/Option'
import * as S from 'fp-ts/lib/string'
import { type Dispatcher } from 'tea-cup-fp'

import {
  type ApiError,
  ApiErrorEq,
  type HttpError,
  getHttpErrorEq,
} from '@/common/api/type'
import { type Article, ArticleEq } from '@/common/api/type/article'
import { type Sort, SortEq } from '@/common/type/filter'
import type { Shared } from '@/type'

export const GET_ARTICLES_LIMIT = 50

export type Model = {
  readonly _tag: 'ArticlesModel'
  readonly pagination: Pagination.Model<Article, HttpError<ApiError>>
  readonly selectedArticle: O.Option<Article>
  readonly searchText: string
  readonly sort: Sort
}

export type Msg =
  | { readonly _tag: 'NoOp' }
  | { readonly _tag: 'SelectArticle'; readonly article: O.Option<Article> }
  | { readonly _tag: 'ChangeSearchText'; readonly text: string }
  | { readonly _tag: 'ChangeSort'; readonly sort: Sort }
  | {
      readonly _tag: 'PaginationMsg'
      readonly subMsg: Pagination.Msg<Article, any, HttpError<ApiError>>
    }

export const ModelEq: EqClass.Eq<Model> = EqClass.struct({
  _tag: S.Eq,
  pagination: Pagination.mkModelEq(ArticleEq, getHttpErrorEq(ApiErrorEq)),
  selectedArticle: O.getEq(ArticleEq),
  searchText: S.Eq,
  sort: SortEq,
})

export type Props = {
  model: Model
  shared: Shared
  dispatch: Dispatcher<Msg>
}

export const PropsEq: EqClass.Eq<Props> = EqClass.struct({
  model: ModelEq,
  shared: EqAlways,
  dispatch: EqAlways,
})
