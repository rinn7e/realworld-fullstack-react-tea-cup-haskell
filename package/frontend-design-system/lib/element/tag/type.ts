import { UndefinableEq } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as boolean from 'fp-ts/lib/boolean'
import * as string from 'fp-ts/lib/string'
import React from 'react'

export type TagColor =
  'white' | 'green' | 'dark-green' | 'sky' | 'amber' | 'red' | 'gray'

export type TagVariant = 'solid' | 'outline'

export type TagSize = 'small' | 'normal' | 'medium' | 'large'

export type TagProps = {
  children?: React.ReactNode
  color?: TagColor
  variant?: TagVariant
  size?: TagSize
  isRounded?: boolean
  onDelete?: () => void
  onClick?: (e: React.MouseEvent<HTMLSpanElement>) => void
  dataTest?: string
  className?: string
}

export const TagPropsEq: EqClass.Eq<TagProps> = EqClass.struct<TagProps>({
  children: EqClass.eqStrict,
  color: UndefinableEq(string.Eq),
  variant: UndefinableEq(string.Eq),
  size: UndefinableEq(string.Eq),
  isRounded: UndefinableEq(boolean.Eq),
  onDelete: EqClass.eqStrict,
  onClick: EqClass.eqStrict,
  dataTest: UndefinableEq(string.Eq),
  className: UndefinableEq(string.Eq),
})
