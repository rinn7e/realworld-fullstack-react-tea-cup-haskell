import * as EqClass from 'fp-ts/lib/Eq'
import * as S from 'fp-ts/lib/string'
import { type Dispatcher } from 'tea-cup-fp'

import { type Direction } from '@/common/type/filter'

export type SearchOption<sortType> = {
  label: string
  value: sortType
}

export type Model<sortType> = {
  searchText: string
  sort: sortType
  direction: Direction
}

export const ModelEq = <sortType>() =>
  EqClass.struct<Model<sortType>>({
    searchText: S.Eq,
    sort: EqClass.fromEquals((a, b) => a === b),
    direction: S.Eq,
  })

export type Msg<sortType> =
  | { _tag: 'ChangeSearchText'; text: string }
  | { _tag: 'ChangeSort'; sort: sortType }
  | { _tag: 'ChangeDirection'; direction: Direction }
  | { _tag: 'Submit' }

export type Props<sortType> = {
  model: Model<sortType>
  sortOptions: SearchOption<sortType>[]
  sortToString: (s: sortType) => string
  placeholder?: string
  dispatch: Dispatcher<Msg<sortType>>
}
