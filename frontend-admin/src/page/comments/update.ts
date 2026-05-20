import * as O from 'fp-ts/lib/Option'
import { Cmd } from 'tea-cup-fp'

import { mockComments } from '@/common/api/type/mock'
import * as SearchBar from '@/component/search-bar'

import { type Model, type Msg } from './type'

export const init = (): [Model, Cmd<Msg>] => {
  const [searchBar, searchBarCmd] = SearchBar.init('', { attr: 'createdAt', direction: 'desc' })

  return [
    {
      _tag: 'CommentsModel',
      comments: mockComments,
      selectedComment: O.none,
      searchBar,
    },
    searchBarCmd.map((m): Msg => ({ _tag: 'SearchBarMsg', subMsg: m })),
  ]
}

export const update = (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
  switch (msg._tag) {
    case 'SelectComment':
      return [{ ...model, selectedComment: msg.comment }, Cmd.none()]
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
