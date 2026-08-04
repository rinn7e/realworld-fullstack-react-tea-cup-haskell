import * as EqClass from 'fp-ts/lib/Eq'
import * as string from 'fp-ts/lib/string'
import type React from 'react'
import type { ReactNode } from 'react'

export type ContentSize = 'small' | 'normal' | 'medium' | 'large'

export type ContentProps = {
  size?: ContentSize
  children?: ReactNode
  className?: string
  key?: React.Key
  dataTest?: string
}

export const ContentPropsEq: EqClass.Eq<ContentProps> = EqClass.struct<
  Required<ContentProps>
>({
  size: string.Eq,
  children: EqClass.eqStrict,
  className: string.Eq,
  key: EqClass.eqStrict,
  dataTest: string.Eq,
}) as unknown as EqClass.Eq<ContentProps>
