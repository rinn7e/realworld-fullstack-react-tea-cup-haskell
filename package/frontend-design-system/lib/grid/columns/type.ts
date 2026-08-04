import * as EqClass from 'fp-ts/Eq'
import * as boolean from 'fp-ts/boolean'
import * as string from 'fp-ts/string'
import type { ReactNode } from 'react'

export type ColumnsProps = {
  isMultiline?: boolean
  children?: ReactNode
  className?: string
  dataTest?: string
}

export const ColumnsPropsEq: EqClass.Eq<ColumnsProps> = EqClass.struct<
  Required<ColumnsProps>
>({
  isMultiline: boolean.Eq,
  children: EqClass.eqStrict,
  className: string.Eq,
  dataTest: string.Eq,
}) as unknown as EqClass.Eq<ColumnsProps>
