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
  type AdminUser,
  AdminUserEq,
  type UserSortAttr,
} from '@/common/api/type/user'
import * as SearchBar from '@/component/search-bar'
import type { Shared } from '@/type'

export const GET_USERS_LIMIT = 50

export type Model = {
  readonly _tag: 'UsersModel'
  readonly pagination: Pagination.Model<AdminUser, HttpError<ApiError>>
  readonly selectedUser: O.Option<AdminUser>
  readonly searchBar: SearchBar.Model<UserSortAttr>
}

export type UserItemMsg = {
  readonly _tag: 'SelectUser'
  readonly user: O.Option<AdminUser>
}

export type Msg =
  | { readonly _tag: 'NoOp' }
  | { readonly _tag: 'ClearSelected' }
  | {
      readonly _tag: 'SearchBarMsg'
      readonly subMsg: SearchBar.Msg<UserSortAttr>
    }
  | {
      readonly _tag: 'PaginationMsg'
      readonly subMsg: Pagination.Msg<
        AdminUser,
        UserItemMsg,
        HttpError<ApiError>
      >
    }

export const ModelEq: EqClass.Eq<Model> = EqClass.struct({
  _tag: S.Eq,
  pagination: Pagination.mkModelEq(AdminUserEq, getHttpErrorEq(ApiErrorEq)),
  selectedUser: O.getEq(AdminUserEq),
  searchBar: SearchBar.ModelEq<UserSortAttr>(),
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
