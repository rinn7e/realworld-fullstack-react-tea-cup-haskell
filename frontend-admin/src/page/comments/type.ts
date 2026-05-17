import { EqAlways } from '@rinn7e/tea-cup-prelude'
import * as A from 'fp-ts/lib/Array'
import * as EqClass from 'fp-ts/lib/Eq'
import * as O from 'fp-ts/lib/Option'
import * as S from 'fp-ts/lib/string'
import { type Dispatcher } from 'tea-cup-fp'

import { type Comment, CommentEq } from '@/common/api/type/comment'
import { type Sort, SortEq } from '@/common/type/filter'

export type Model = {
  readonly _tag: 'CommentsModel'
  readonly comments: Comment[]
  readonly selectedComment: O.Option<Comment>
  readonly searchText: string
  readonly sort: Sort
}

export type Msg =
  | { readonly _tag: 'NoOp' }
  | { readonly _tag: 'SelectComment'; readonly comment: O.Option<Comment> }
  | { readonly _tag: 'ChangeSearchText'; readonly text: string }
  | { readonly _tag: 'ChangeSort'; readonly sort: Sort }

export const ModelEq: EqClass.Eq<Model> = EqClass.struct({
  _tag: S.Eq,
  comments: A.getEq(CommentEq),
  selectedComment: O.getEq(CommentEq),
  searchText: S.Eq,
  sort: SortEq,
})

export type Props = {
  model: Model
  dispatch: Dispatcher<Msg>
}

export const PropsEq: EqClass.Eq<Props> = EqClass.struct({
  model: ModelEq,
  dispatch: EqAlways,
})
