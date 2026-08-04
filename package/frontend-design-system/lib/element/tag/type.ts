import * as EqClass from 'fp-ts/lib/Eq'
import * as boolean from 'fp-ts/lib/boolean'
import * as string from 'fp-ts/lib/string'
import React from 'react'

export type TagColor = 'gray' | 'green' | 'dark-green' | 'sky' | 'amber' | 'red'

export type TagVariant = 'solid' | 'light' | 'outline'

export type TagSize = 'small' | 'normal' | 'medium' | 'large'

export type TagProps = {
  children?: React.ReactNode
  color?: TagColor
  variant?: TagVariant
  size?: TagSize
  isRounded?: boolean
  onDelete?: () => void
  onClick?: (e: React.MouseEvent<HTMLSpanElement>) => void
  key?: React.Key
  dataTest?: string
  className?: string
}

export const TagPropsEq: EqClass.Eq<TagProps> = EqClass.struct<
  Required<TagProps>
>({
  children: EqClass.eqStrict,
  color: string.Eq,
  variant: string.Eq,
  size: string.Eq,
  isRounded: boolean.Eq,
  onDelete: EqClass.eqStrict,
  onClick: EqClass.eqStrict,
  key: EqClass.eqStrict,
  dataTest: string.Eq,
  className: string.Eq,
}) as unknown as EqClass.Eq<TagProps>
