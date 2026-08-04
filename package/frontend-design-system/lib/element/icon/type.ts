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

export const IconPropsEq: EqClass.Eq<IconProps> = EqClass.struct<
  Required<IconProps>
>({
  children: EqClass.eqStrict,
  size: string.Eq,
  className: string.Eq,
  dataTest: string.Eq,
}) as unknown as EqClass.Eq<IconProps>
