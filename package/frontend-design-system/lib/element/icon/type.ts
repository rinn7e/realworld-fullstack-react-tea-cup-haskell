import { UndefinableEq } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as string from 'fp-ts/lib/string'
import React from 'react'

export type IconSize = 'small' | 'normal' | 'medium' | 'large'

export type IconProps = {
  children?: React.ReactNode
  size?: IconSize
  className?: string
  dataTest?: string
}

export const IconPropsEq: EqClass.Eq<IconProps> = EqClass.struct<IconProps>({
  children: EqClass.eqStrict,
  size: UndefinableEq(string.Eq),
  className: UndefinableEq(string.Eq),
  dataTest: UndefinableEq(string.Eq),
})
