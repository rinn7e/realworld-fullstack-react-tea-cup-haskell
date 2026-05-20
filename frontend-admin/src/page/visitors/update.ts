import * as O from 'fp-ts/lib/Option'
import { Cmd } from 'tea-cup-fp'

import { mockVisitors } from '@/common/api/type/mock'
import { type VisitorSortAttr } from '@/common/api/type/visitor'
import * as SearchBar from '@/component/search-bar'

import { type Model, type Msg } from './type'

export const init = (): [Model, Cmd<Msg>] => {
  const [searchBar, searchBarCmd] = SearchBar.init<VisitorSortAttr>(
    '',
    'timestamp',
    'desc',
  )

  return [
    {
      _tag: 'VisitorsModel',
      visitors: mockVisitors,
      selectedVisitor: O.none,
      searchBar,
    },
    searchBarCmd.map((m): Msg => ({ _tag: 'SearchBarMsg', subMsg: m })),
  ]
}

export const update = (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
  switch (msg._tag) {
    case 'SelectVisitor':
      return [{ ...model, selectedVisitor: msg.visitor }, Cmd.none()]
    case 'SearchBarMsg':
      return searchBarMsgHandler(msg.subMsg, model)
    case 'NoOp':
      return [model, Cmd.none()]
  }
}

const searchBarMsgHandler = (
  subMsg: SearchBar.Msg<VisitorSortAttr>,
  model: Model,
): [Model, Cmd<Msg>] => {
  const [searchBar, searchBarCmd] = SearchBar.update<VisitorSortAttr>(
    subMsg,
    model.searchBar,
  )
  return [
    { ...model, searchBar },
    searchBarCmd.map((m): Msg => ({ _tag: 'SearchBarMsg', subMsg: m })),
  ]
}
