import { UndefinableEq } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as boolean from 'fp-ts/lib/boolean'
import * as string from 'fp-ts/lib/string'
import React from 'react'

export type TableProps = {
  children?: React.ReactNode
  isBordered?: boolean
  isStriped?: boolean
  isNarrow?: boolean
  isHoverable?: boolean
  isFullWidth?: boolean
  className?: string
  dataTest?: string
}

export const TablePropsEq: EqClass.Eq<TableProps> = EqClass.struct<TableProps>({
  children: EqClass.eqStrict,
  isBordered: UndefinableEq(boolean.Eq),
  isStriped: UndefinableEq(boolean.Eq),
  isNarrow: UndefinableEq(boolean.Eq),
  isHoverable: UndefinableEq(boolean.Eq),
  isFullWidth: UndefinableEq(boolean.Eq),
  className: UndefinableEq(string.Eq),
  dataTest: UndefinableEq(string.Eq),
})
