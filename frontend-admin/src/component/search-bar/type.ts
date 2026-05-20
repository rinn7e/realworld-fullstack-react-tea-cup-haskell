import * as EqClass from 'fp-ts/lib/Eq'
import * as S from 'fp-ts/lib/string'
import { type Dispatcher } from 'tea-cup-fp'

import { type Sort, SortEq } from '@/common/type/filter'

export type SearchOption = {
  label: string
  value: string
}

export type Model = {
  searchText: string
  sort: Sort
}

export const ModelEq = EqClass.struct<Model>({
  searchText: S.Eq,
  sort: SortEq,
})

export type Msg =
  | { _tag: 'ChangeSearchText'; text: string }
  | { _tag: 'ChangeSort'; sort: Sort }
  | { _tag: 'Submit' }

export type Props = {
  model: Model
  sortOptions: SearchOption[]
  placeholder?: string
  dispatch: Dispatcher<Msg>
}

export const PropsEq = EqClass.struct<Props>({
  dispatch: { equals: () => true },
  model: ModelEq,
  sortOptions: EqClass.fromEquals(
    (a, b) => JSON.stringify(a) === JSON.stringify(b),
  ),
  placeholder: EqClass.fromEquals((a, b) => a === b),
})
