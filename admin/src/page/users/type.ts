import { EqAlways } from '@rinn7e/tea-cup-prelude'
import * as A from 'fp-ts/lib/Array'
import * as EqClass from 'fp-ts/lib/Eq'
import * as O from 'fp-ts/lib/Option'
import * as S from 'fp-ts/lib/string'
import { type Dispatcher } from 'tea-cup-fp'

import { type User, UserEq } from '@/common/api/type/user'
import { type Sort, SortEq } from '@/common/type/filter'

export type Model = {
  readonly _tag: 'UsersModel'
  readonly users: User[]
  readonly selectedUser: O.Option<User>
  readonly searchText: string
  readonly sort: Sort
}

export type Msg =
  | { readonly _tag: 'NoOp' }
  | { readonly _tag: 'SelectUser'; readonly user: O.Option<User> }
  | { readonly _tag: 'ChangeSearchText'; readonly text: string }
  | { readonly _tag: 'ChangeSort'; readonly sort: Sort }

export const ModelEq: EqClass.Eq<Model> = EqClass.struct({
  _tag: S.Eq,
  users: A.getEq(UserEq),
  selectedUser: O.getEq(UserEq),
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
