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
import {
  type Article,
  ArticleEq,
  type ArticleSortAttr,
} from '@/common/api/type/article'
import * as SearchBar from '@/component/search-bar'
import { SharedEq, type Shared } from '@/common/type/shared'

export const GET_ARTICLES_LIMIT = 50

export type Model = {
  readonly _tag: 'ArticlesModel'
  readonly pagination: Pagination.Model<Article, HttpError<ApiError>>
  readonly selectedArticle: O.Option<Article>
  readonly searchBar: SearchBar.Model<ArticleSortAttr>
}

export type ArticleItemMsg = {
  readonly _tag: 'SelectArticle'
  readonly article: O.Option<Article>
}

export type Msg =
  | { readonly _tag: 'NoOp' }
  | { readonly _tag: 'ClearSelected' }
  | {
      readonly _tag: 'SearchBarMsg'
      readonly subMsg: SearchBar.Msg<ArticleSortAttr>
    }
  | {
      readonly _tag: 'PaginationMsg'
      readonly subMsg: Pagination.Msg<
        Article,
        ArticleItemMsg,
        HttpError<ApiError>
      >
    }

export const ModelEq: EqClass.Eq<Model> = EqClass.struct({
  _tag: S.Eq,
  pagination: Pagination.mkModelEq(ArticleEq, getHttpErrorEq(ApiErrorEq)),
  selectedArticle: O.getEq(ArticleEq),
  searchBar: SearchBar.ModelEq<ArticleSortAttr>(),
})

export type Props = {
  model: Model
  shared: Shared
  dispatch: Dispatcher<Msg>
}

export const PropsEq: EqClass.Eq<Props> = EqClass.struct({
  model: ModelEq,
  shared: SharedEq,
  dispatch: EqAlways,
})
