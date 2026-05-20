import { EqAlways } from '@rinn7e/tea-cup-prelude'
import * as A from 'fp-ts/lib/Array'
import * as EqClass from 'fp-ts/lib/Eq'
import * as O from 'fp-ts/lib/Option'
import * as S from 'fp-ts/lib/string'
import { type Dispatcher } from 'tea-cup-fp'

import { type User, UserEq, type UserSortAttr } from '@/common/api/type/user'
import * as SearchBar from '@/component/search-bar'

export type Model = {
  readonly _tag: 'UsersModel'
  readonly users: User[]
  readonly selectedUser: O.Option<User>
  readonly searchBar: SearchBar.Model<UserSortAttr>
}

export type Msg =
  | { readonly _tag: 'NoOp' }
  | { readonly _tag: 'SelectUser'; readonly user: O.Option<User> }
  | {
      readonly _tag: 'SearchBarMsg'
      readonly subMsg: SearchBar.Msg<UserSortAttr>
    }

export const ModelEq: EqClass.Eq<Model> = EqClass.struct({
  _tag: S.Eq,
  users: A.getEq(UserEq),
  selectedUser: O.getEq(UserEq),
  searchBar: SearchBar.ModelEq<UserSortAttr>(),
})

export type Props = {
  model: Model
  dispatch: Dispatcher<Msg>
}

export const PropsEq: EqClass.Eq<Props> = EqClass.struct({
  model: ModelEq,
  dispatch: EqAlways,
})
