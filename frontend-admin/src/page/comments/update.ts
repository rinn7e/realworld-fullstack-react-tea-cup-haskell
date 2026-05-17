import * as O from 'fp-ts/lib/Option'
import { Cmd } from 'tea-cup-fp'

import { mockComments } from '@/common/api/type/mock'

import { type Model, type Msg } from './type'

export const init = (): [Model, Cmd<Msg>] => {
  return [
    {
      _tag: 'CommentsModel',
      comments: mockComments,
      selectedComment: O.none,
      searchText: '',
      sort: { attr: 'createdAt', direction: 'desc' },
    },
    Cmd.none(),
  ]
}

export const update = (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
  switch (msg._tag) {
    case 'SelectComment':
      return [{ ...model, selectedComment: msg.comment }, Cmd.none()]
    case 'ChangeSearchText':
      return [{ ...model, searchText: msg.text }, Cmd.none()]
    case 'ChangeSort':
      return [{ ...model, sort: msg.sort }, Cmd.none()]
    case 'NoOp':
      return [model, Cmd.none()]
  }
}
