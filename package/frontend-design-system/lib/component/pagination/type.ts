import * as EqClass from 'fp-ts/lib/Eq'
import type React from 'react'

export type Model = {
  currentPage: number
  totalPages: number
}

export const ModelEq: EqClass.Eq<Model> = EqClass.struct({
  currentPage: EqClass.eqNumber,
  totalPages: EqClass.eqNumber,
})

export type Msg = { _tag: 'SetPage'; page: number }

export type PaginationProps = {
  model: Model
  dispatch: (msg: Msg) => void
  onPageChange?: (page: number) => void
  className?: string
  key?: React.Key
  dataTest?: string
}

export const PaginationPropsEq: EqClass.Eq<PaginationProps> = EqClass.struct<
  Required<PaginationProps>
>({
  model: ModelEq,
  dispatch: EqClass.eqStrict,
  onPageChange: EqClass.eqStrict,
  className: EqClass.eqStrict,
  key: EqClass.eqStrict,
  dataTest: EqClass.eqStrict,
}) as unknown as EqClass.Eq<PaginationProps>
