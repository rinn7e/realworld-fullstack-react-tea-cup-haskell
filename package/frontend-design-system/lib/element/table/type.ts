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
  key?: React.Key
  dataTest?: string
}

export const TablePropsEq: EqClass.Eq<TableProps> = EqClass.struct<
  Required<TableProps>
>({
  children: EqClass.eqStrict,
  isBordered: boolean.Eq,
  isStriped: boolean.Eq,
  isNarrow: boolean.Eq,
  isHoverable: boolean.Eq,
  isFullWidth: boolean.Eq,
  className: string.Eq,
  key: EqClass.eqStrict,
  dataTest: string.Eq,
}) as unknown as EqClass.Eq<TableProps>
