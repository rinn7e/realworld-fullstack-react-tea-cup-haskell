import * as EqClass from 'fp-ts/Eq'
import * as string from 'fp-ts/string'
import type React from 'react'

export type SectionSize = 'medium' | 'large'

export type SectionProps = {
  children: () => React.ReactNode
  size?: SectionSize
  className?: string
  key?: React.Key
  dataTest?: string
}

export const SectionPropsEq: EqClass.Eq<SectionProps> = EqClass.struct<
  Required<SectionProps>
>({
  children: EqClass.eqStrict,
  size: EqClass.eqStrict,
  className: string.Eq,
  key: EqClass.eqStrict,
  dataTest: string.Eq,
}) as unknown as EqClass.Eq<SectionProps>
