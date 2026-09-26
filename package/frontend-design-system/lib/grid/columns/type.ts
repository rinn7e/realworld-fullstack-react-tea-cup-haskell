import { UndefinableEq } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as boolean from 'fp-ts/lib/boolean'
import * as string from 'fp-ts/lib/string'
import type { ReactNode } from 'react'

export type ColumnsProps = {
  isMultiline?: boolean
  children?: ReactNode
  className?: string
  dataTest?: string
}

export const ColumnsPropsEq: EqClass.Eq<ColumnsProps> =
  EqClass.struct<ColumnsProps>({
    isMultiline: UndefinableEq(boolean.Eq),
    children: EqClass.eqStrict,
    className: UndefinableEq(string.Eq),
    dataTest: UndefinableEq(string.Eq),
  })
