import * as EqClass from 'fp-ts/lib/Eq'
import * as string from 'fp-ts/lib/string'
import type React from 'react'

export type BoxProps = {
  children?: React.ReactNode
  className?: string
  dataTest?: string
}

export const BoxPropsEq: EqClass.Eq<BoxProps> = EqClass.struct<
  Required<BoxProps>
>({
  children: EqClass.eqStrict,
  className: string.Eq,
  dataTest: string.Eq,
}) as unknown as EqClass.Eq<BoxProps>
