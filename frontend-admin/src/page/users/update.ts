import * as RD from '@devexperts/remote-data-ts'
import * as Pagination from '@rinn7e/tea-cup-pagination'
import { updateAndCmd } from '@rinn7e/tea-cup-prelude'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import { Cmd } from 'tea-cup-fp'

import { type UserSortAttr } from '@/common/api/type/user'
import * as SearchBar from '@/component/search-bar'
import { type Shared } from '@/common/type/shared'

import { mkPaginationConfig } from './helper'
import { type Model, type Msg } from './type'

export const init = (shared: Shared): [Model, Cmd<Msg>] => {
  const [searchBar, searchBarCmd] = SearchBar.init<UserSortAttr>(
    '',
    'username',
    'asc',
  )

  const initialModel: Model = {
    _tag: 'UsersModel',
    pagination: {
      items: RD.pending,
      page: 1,
      pageAmount: 0,
    },
    selectedUser: O.none,
    searchBar,
  }

  const paginationConfig = mkPaginationConfig(shared, initialModel)
  const [pagination, paginationCmd] = Pagination.init(paginationConfig, 1)

  const model: Model = {
    ...initialModel,
    pagination,
  }

  return [
    model,
    Cmd.batch([
      paginationCmd.map((m): Msg => ({ _tag: 'PaginationMsg', subMsg: m })),
      searchBarCmd.map((m): Msg => ({ _tag: 'SearchBarMsg', subMsg: m })),
    ]),
  ]
}

export const update =
  (shared: Shared) =>
  (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
    switch (msg._tag) {
      case 'ClearSelected':
        return [{ ...model, selectedUser: O.none }, Cmd.none()]
      case 'SearchBarMsg':
        return searchBarMsgHandler(shared, msg.subMsg, model)
      case 'PaginationMsg':
        return paginationMsgHandler(shared, msg.subMsg, model)
      case 'NoOp':
        return [model, Cmd.none()]
    }
  }

const searchBarMsgHandler = (
  shared: Shared,
  subMsg: SearchBar.Msg<UserSortAttr>,
  model: Model,
): [Model, Cmd<Msg>] => {
  const [searchBar, searchBarCmd] = SearchBar.update<UserSortAttr>(
    subMsg,
    model.searchBar,
  )

  return pipe(
    [
      { ...model, searchBar },
      searchBarCmd.map((m): Msg => ({ _tag: 'SearchBarMsg', subMsg: m })),
    ],
    updateAndCmd((m) => {
      if (
        subMsg._tag === 'Submit' ||
        subMsg._tag === 'ChangeSort' ||
        subMsg._tag === 'ChangeDirection'
      ) {
        const paginationConfig = mkPaginationConfig(shared, m)
        const [pagination, paginationCmd] = Pagination.init(paginationConfig, 1)
        return [
          { ...m, pagination },
          paginationCmd.map(
            (pm): Msg => ({ _tag: 'PaginationMsg', subMsg: pm }),
          ),
        ]
      } else {
        return [m, Cmd.none()]
      }
    }),
  )
}

const paginationMsgHandler = (
  shared: Shared,
  subMsg: Extract<Msg, { _tag: 'PaginationMsg' }>['subMsg'],
  model: Model,
): [Model, Cmd<Msg>] => {
  const paginationConfig = mkPaginationConfig(shared, model)
  const [pagination, paginationCmd] = Pagination.update(paginationConfig)(
    subMsg,
    model.pagination,
  )

  return pipe(
    [
      { ...model, pagination },
      paginationCmd.map((m): Msg => ({ _tag: 'PaginationMsg', subMsg: m })),
    ] as [Model, Cmd<Msg>],
    updateAndCmd((m) => {
      if (subMsg._tag === 'ItemMsg') {
        return paginationItemMsgHandler(subMsg.msg)(m)
      } else {
        return [m, Cmd.none()]
      }
    }),
  )
}

const paginationItemMsgHandler =
  (msg: any) =>
  (m: Model): [Model, Cmd<Msg>] => {
    switch (msg._tag) {
      case 'SelectUser':
        return [{ ...m, selectedUser: msg.user }, Cmd.none()]
      default:
        return [m, Cmd.none()]
    }
  }
