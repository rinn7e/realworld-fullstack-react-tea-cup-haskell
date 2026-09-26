import { UndefinableEq } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as string from 'fp-ts/lib/string'
import type { ReactNode } from 'react'

export type HeroColor =
  'white' | 'green' | 'dark-green' | 'sky' | 'amber' | 'red' | 'gray'

export type HeroSize = 'small' | 'medium' | 'large' | 'fullheight'

export type HeroProps = {
  color?: HeroColor
  size?: HeroSize
  title?: ReactNode
  subtitle?: ReactNode
  header?: ReactNode
  footer?: ReactNode
  children?: ReactNode
  className?: string
  dataTest?: string
}

export const HeroPropsEq: EqClass.Eq<HeroProps> = EqClass.struct<HeroProps>({
  color: EqClass.eqStrict,
  size: EqClass.eqStrict,
  title: EqClass.eqStrict,
  subtitle: EqClass.eqStrict,
  header: EqClass.eqStrict,
  footer: EqClass.eqStrict,
  children: EqClass.eqStrict,
  className: UndefinableEq(string.Eq),
  dataTest: UndefinableEq(string.Eq),
})
