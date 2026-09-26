import { UndefinableEq } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as string from 'fp-ts/lib/string'
import type React from 'react'

export type BoxProps = {
  children?: React.ReactNode
  className?: string
  dataTest?: string
}

export const BoxPropsEq: EqClass.Eq<BoxProps> = EqClass.struct<BoxProps>({
  children: EqClass.eqStrict,
  className: UndefinableEq(string.Eq),
  dataTest: UndefinableEq(string.Eq),
})
