import * as O from 'fp-ts/lib/Option'
import { Cmd } from 'tea-cup-fp'

import { mockUsers } from '@/common/api/type/mock'
import * as SearchBar from '@/component/search-bar'

import { type Model, type Msg } from './type'

export const init = (): [Model, Cmd<Msg>] => {
  const [searchBar, searchBarCmd] = SearchBar.init('', { attr: 'username', direction: 'asc' })

  return [
    {
      _tag: 'UsersModel',
      users: mockUsers,
      selectedUser: O.none,
      searchBar,
    },
    searchBarCmd.map((m): Msg => ({ _tag: 'SearchBarMsg', subMsg: m })),
  ]
}

export const update = (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
  switch (msg._tag) {
    case 'SelectUser':
      return [{ ...model, selectedUser: msg.user }, Cmd.none()]
    case 'SearchBarMsg': {
      const [searchBar, searchBarCmd] = SearchBar.update(msg.subMsg, model.searchBar)
      return [
        { ...model, searchBar },
        searchBarCmd.map((m): Msg => ({ _tag: 'SearchBarMsg', subMsg: m })),
      ]
    }
    case 'NoOp':
      return [model, Cmd.none()]
  }
}
