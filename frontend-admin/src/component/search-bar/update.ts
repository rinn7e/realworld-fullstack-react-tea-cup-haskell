import { Cmd } from 'tea-cup-fp'

import { type Direction } from '@/common/type/filter'

import { type Model, type Msg } from './type'

export const init = <sortType>(
  initialSearchText: string,
  initialSort: sortType,
  initialDirection: Direction,
): [Model<sortType>, Cmd<Msg<sortType>>] => {
  return [
    {
      searchText: initialSearchText,
      sort: initialSort,
      direction: initialDirection,
    },
    Cmd.none(),
  ]
}

export const update = <sortType>(
  msg: Msg<sortType>,
  model: Model<sortType>,
): [Model<sortType>, Cmd<Msg<sortType>>] => {
  switch (msg._tag) {
    case 'ChangeSearchText':
      return [{ ...model, searchText: msg.text }, Cmd.none()]
    case 'ChangeSort':
      return [{ ...model, sort: msg.sort }, Cmd.none()]
    case 'ChangeDirection':
      return [{ ...model, direction: msg.direction }, Cmd.none()]
    case 'Submit':
      return [model, Cmd.none()]
  }
}
