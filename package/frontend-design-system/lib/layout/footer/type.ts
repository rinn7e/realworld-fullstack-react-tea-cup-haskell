import * as EqClass from 'fp-ts/Eq'
import * as string from 'fp-ts/string'
import type React from 'react'

export type FooterProps = {
  children?: () => React.ReactNode
  className?: string
  dataTest?: string
}

export const FooterPropsEq: EqClass.Eq<FooterProps> = EqClass.struct<
  Required<FooterProps>
>({
  children: EqClass.eqStrict,
  className: string.Eq,
  dataTest: string.Eq,
}) as unknown as EqClass.Eq<FooterProps>
