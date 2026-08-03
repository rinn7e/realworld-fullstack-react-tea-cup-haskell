import * as EqClass from 'fp-ts/Eq'
import * as string from 'fp-ts/string'
import type React from 'react'
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
  children: () => ReactNode
  className?: string
  key?: React.Key
  dataTest?: string
}

export const ColumnPropsEq: EqClass.Eq<ColumnProps> = EqClass.struct<
  Required<ColumnProps>
>({
  size: EqClass.eqStrict,
  children: EqClass.eqStrict,
  className: string.Eq,
  key: EqClass.eqStrict,
  dataTest: string.Eq,
}) as unknown as EqClass.Eq<ColumnProps>
