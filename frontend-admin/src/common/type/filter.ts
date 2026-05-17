import * as EqClass from 'fp-ts/lib/Eq'
import * as S from 'fp-ts/lib/string'

export type FilterMode = 'include' | 'exclude'

export type Filter = {
  attr: string
  value: string
  mode: FilterMode
}

export const FilterEq = EqClass.struct<Filter>({
  attr: S.Eq,
  value: S.Eq,
  mode: S.Eq as any,
})

export type SortDirection = 'asc' | 'desc'

export type Sort = {
  attr: string
  direction: SortDirection
}

export const SortEq = EqClass.struct<Sort>({
  attr: S.Eq,
  direction: S.Eq as any,
})
