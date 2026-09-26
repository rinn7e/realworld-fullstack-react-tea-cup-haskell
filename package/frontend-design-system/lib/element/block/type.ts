import { UndefinableEq } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as string from 'fp-ts/lib/string'
import type React from 'react'

export type BlockProps = {
  children?: React.ReactNode
  className?: string
  dataTest?: string
}

export const BlockPropsEq: EqClass.Eq<BlockProps> = EqClass.struct<BlockProps>({
  children: EqClass.eqStrict,
  className: UndefinableEq(string.Eq),
  dataTest: UndefinableEq(string.Eq),
})
