import { Cmd } from 'tea-cup-fp'

import { type Sort } from '@/common/type/filter'

import { type Model, type Msg } from './type'

export const init = (initialSearchText: string, initialSort: Sort): [Model, Cmd<Msg>] => {
  return [
    {
      searchText: initialSearchText,
      sort: initialSort,
    },
    Cmd.none(),
  ]
}

export const update = (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
  switch (msg._tag) {
    case 'ChangeSearchText':
      return [{ ...model, searchText: msg.text }, Cmd.none()]
    case 'ChangeSort':
      return [{ ...model, sort: msg.sort }, Cmd.none()]
    case 'Submit':
      return [model, Cmd.none()]
  }
}
