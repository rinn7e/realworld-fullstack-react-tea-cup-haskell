import * as O from 'fp-ts/lib/Option'
import { Cmd } from 'tea-cup-fp'

import { mockUsers } from '@/common/api/type/mock'

import { type Model, type Msg } from './type'

export const init = (): [Model, Cmd<Msg>] => {
  return [
    {
      _tag: 'UsersModel',
      users: mockUsers,
      selectedUser: O.none,
      searchText: '',
      sort: { attr: 'username', direction: 'asc' },
    },
    Cmd.none(),
  ]
}

export const update = (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
  switch (msg._tag) {
    case 'SelectUser':
      return [{ ...model, selectedUser: msg.user }, Cmd.none()]
    case 'ChangeSearchText':
      return [{ ...model, searchText: msg.text }, Cmd.none()]
    case 'ChangeSort':
      return [{ ...model, sort: msg.sort }, Cmd.none()]
    case 'NoOp':
      return [model, Cmd.none()]
  }
}
