import React from 'react'
import * as EqClass from 'fp-ts/lib/Eq'
import * as boolean from 'fp-ts/lib/boolean'
import * as number from 'fp-ts/lib/number'
import * as string from 'fp-ts/lib/string'

export type TitleSize = 1 | 2 | 3 | 4 | 5 | 6

export type TitleProps = {
  children: () => React.ReactNode
  size?: TitleSize
  isSubtitle?: boolean
  className?: string
  key?: React.Key
  dataTest?: string
}

export const TitlePropsEq: EqClass.Eq<TitleProps> = EqClass.struct<Required<TitleProps>>({
  children: EqClass.eqStrict,
  size: number.Eq,
  isSubtitle: boolean.Eq,
  className: string.Eq,
  key: EqClass.eqStrict,
  dataTest: string.Eq,
}) as unknown as EqClass.Eq<TitleProps>
