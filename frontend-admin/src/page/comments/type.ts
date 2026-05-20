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
import { type Comment, CommentEq } from '@/common/api/type/comment'
import { type CommentSortAttr } from '@/common/api/type/comment'
import * as SearchBar from '@/component/search-bar'
import { type Shared } from '@/type'

export const GET_COMMENTS_LIMIT = 50

export type Model = {
  readonly _tag: 'CommentsModel'
  readonly pagination: Pagination.Model<Comment, HttpError<ApiError>>
  readonly selectedComment: O.Option<Comment>
  readonly searchBar: SearchBar.Model<CommentSortAttr>
}

export type CommentItemMsg = {
  readonly _tag: 'SelectComment'
  readonly comment: O.Option<Comment>
}

export type Msg =
  | { readonly _tag: 'NoOp' }
  | { readonly _tag: 'ClearSelected' }
  | { readonly _tag: 'SearchBarMsg'; readonly subMsg: SearchBar.Msg<CommentSortAttr> }
  | {
      readonly _tag: 'PaginationMsg'
      readonly subMsg: Pagination.Msg<
        Comment,
        CommentItemMsg,
        HttpError<ApiError>
      >
    }

export const ModelEq: EqClass.Eq<Model> = EqClass.struct({
  _tag: S.Eq,
  pagination: Pagination.mkModelEq(CommentEq, getHttpErrorEq(ApiErrorEq)),
  selectedComment: O.getEq(CommentEq),
  searchBar: SearchBar.ModelEq as any,
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
