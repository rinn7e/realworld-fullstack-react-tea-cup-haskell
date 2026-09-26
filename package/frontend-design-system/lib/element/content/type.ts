import { UndefinableEq } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as string from 'fp-ts/lib/string'
import type { ReactNode } from 'react'

export type ContentSize = 'small' | 'normal' | 'medium' | 'large'

export type ContentProps = {
  size?: ContentSize
  children?: ReactNode
  className?: string
  dataTest?: string
}

export const ContentPropsEq: EqClass.Eq<ContentProps> =
  EqClass.struct<ContentProps>({
    size: UndefinableEq(string.Eq),
    children: EqClass.eqStrict,
    className: UndefinableEq(string.Eq),
    dataTest: UndefinableEq(string.Eq),
  })
