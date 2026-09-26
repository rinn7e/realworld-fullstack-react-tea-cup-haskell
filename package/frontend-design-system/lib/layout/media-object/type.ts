import { UndefinableEq } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as string from 'fp-ts/lib/string'
import type React from 'react'

export type MediaObjectProps = {
  left?: React.ReactNode
  children?: React.ReactNode
  right?: React.ReactNode
  className?: string
  dataTest?: string
}

export const MediaObjectPropsEq: EqClass.Eq<MediaObjectProps> =
  EqClass.struct<MediaObjectProps>({
    left: EqClass.eqStrict,
    children: EqClass.eqStrict,
    right: EqClass.eqStrict,
    className: UndefinableEq(string.Eq),
    dataTest: UndefinableEq(string.Eq),
  })
