import { UndefinableEq } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as string from 'fp-ts/lib/string'
import type { ReactNode } from 'react'

export type ColumnSize =
  | 'full'
  | 'half'
  | 'one-third'
  | 'two-thirds'
  | 'one-quarter'
  | 'three-quarters'

export type ColumnProps = {
  size?: ColumnSize
  children?: ReactNode
  className?: string
  dataTest?: string
}

export const ColumnPropsEq: EqClass.Eq<ColumnProps> =
  EqClass.struct<ColumnProps>({
    size: EqClass.eqStrict,
    children: EqClass.eqStrict,
    className: UndefinableEq(string.Eq),
    dataTest: UndefinableEq(string.Eq),
  })
