import * as Pagination from '@rinn7e/tea-cup-pagination'
import { EqAlways } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as O from 'fp-ts/lib/Option'
import * as B from 'fp-ts/lib/boolean'
import * as S from 'fp-ts/lib/string'
import { type Dispatcher } from 'tea-cup-fp'

import {
  type ApiError,
  ApiErrorEq,
  type HttpError,
  getHttpErrorEq,
} from '@/common/api/type'
import {
  type Visitor,
  VisitorEq,
  type VisitorSortAttr,
} from '@/common/api/type/visitor'
import { type Shared, SharedEq } from '@/common/type/shared'
import * as SearchBar from '@/component/search-bar'

export const GET_VISITORS_LIMIT = 50

export type Model = {
  readonly _tag: 'VisitorsModel'
  readonly pagination: Pagination.Model<Visitor, HttpError<ApiError>>
  readonly selectedVisitor: O.Option<Visitor>
  readonly searchBar: SearchBar.Model<VisitorSortAttr>
  readonly isDescriptionOpen: boolean
}

export type VisitorItemMsg = {
  readonly _tag: 'SelectVisitor'
  readonly visitor: O.Option<Visitor>
}

export type Msg =
  | { readonly _tag: 'NoOp' }
  | { readonly _tag: 'ClearSelected' }
  | { readonly _tag: 'ToggleDescription' }
  | {
      readonly _tag: 'SearchBarMsg'
      readonly subMsg: SearchBar.Msg<VisitorSortAttr>
    }
  | {
      readonly _tag: 'PaginationMsg'
      readonly subMsg: Pagination.Msg<
        Visitor,
        VisitorItemMsg,
        HttpError<ApiError>
      >
    }

export const ModelEq: EqClass.Eq<Model> = EqClass.struct({
  _tag: S.Eq,
  pagination: Pagination.mkModelEq(VisitorEq, getHttpErrorEq(ApiErrorEq)),
  selectedVisitor: O.getEq(VisitorEq),
  searchBar: SearchBar.ModelEq<VisitorSortAttr>(),
  isDescriptionOpen: B.Eq,
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
