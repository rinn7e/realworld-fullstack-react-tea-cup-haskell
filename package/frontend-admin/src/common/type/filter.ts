import * as EqClass from 'fp-ts/lib/Eq'
import * as S from 'fp-ts/lib/string'

export type FilterMode = 'include' | 'exclude'

export type Filter = {
  attr: string
  value: string
  mode: FilterMode
}

export const FilterEq: EqClass.Eq<Filter> = EqClass.struct<Filter>({
  attr: S.Eq,
  value: S.Eq,
  mode: S.Eq,
})

export type Direction = 'asc' | 'desc'
