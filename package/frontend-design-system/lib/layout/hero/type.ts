import * as EqClass from 'fp-ts/Eq'
import * as string from 'fp-ts/string'
import type React from 'react'
import type { ReactNode } from 'react'

export type HeroVariant =
  | 'default'
  | 'primary'
  | 'link'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'

export type HeroSize = 'small' | 'medium' | 'large' | 'fullheight'

export type HeroProps = {
  variant?: HeroVariant
  size?: HeroSize
  title?: ReactNode
  subtitle?: ReactNode
  header?: ReactNode
  footer?: ReactNode
  children?: () => ReactNode
  className?: string
  key?: React.Key
  dataTest?: string
}

export const HeroPropsEq: EqClass.Eq<HeroProps> = EqClass.struct<
  Required<HeroProps>
>({
  variant: EqClass.eqStrict,
  size: EqClass.eqStrict,
  title: EqClass.eqStrict,
  subtitle: EqClass.eqStrict,
  header: EqClass.eqStrict,
  footer: EqClass.eqStrict,
  children: EqClass.eqStrict,
  className: string.Eq,
  key: EqClass.eqStrict,
  dataTest: string.Eq,
}) as unknown as EqClass.Eq<HeroProps>
