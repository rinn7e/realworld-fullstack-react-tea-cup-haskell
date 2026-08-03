import * as EqClass from 'fp-ts/lib/Eq'
import type React from 'react'

export type CardProps = {
  header?: React.ReactNode
  image?: React.ReactNode
  children?: React.ReactNode
  footer?: React.ReactNode
  className?: string
  key?: React.Key
  dataTest?: string
}

export const CardPropsEq: EqClass.Eq<CardProps> = EqClass.struct<
  Required<CardProps>
>({
  header: EqClass.eqStrict,
  image: EqClass.eqStrict,
  children: EqClass.eqStrict,
  footer: EqClass.eqStrict,
  className: EqClass.eqStrict,
  key: EqClass.eqStrict,
  dataTest: EqClass.eqStrict,
}) as unknown as EqClass.Eq<CardProps>
