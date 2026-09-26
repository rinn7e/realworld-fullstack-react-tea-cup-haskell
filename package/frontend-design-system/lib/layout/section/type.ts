import { UndefinableEq } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as string from 'fp-ts/lib/string'
import type React from 'react'

export type SectionSize = 'medium' | 'large'

export type SectionProps = {
  children?: React.ReactNode
  size?: SectionSize
  className?: string
  dataTest?: string
}

export const SectionPropsEq: EqClass.Eq<SectionProps> =
  EqClass.struct<SectionProps>({
    children: EqClass.eqStrict,
    size: EqClass.eqStrict,
    className: UndefinableEq(string.Eq),
    dataTest: UndefinableEq(string.Eq),
  })
