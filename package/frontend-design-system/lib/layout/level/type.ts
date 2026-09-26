import { UndefinableEq } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as boolean from 'fp-ts/lib/boolean'
import * as string from 'fp-ts/lib/string'
import type { ReactNode } from 'react'

export type LevelProps = {
  children?: ReactNode
  className?: string
  dataTest?: string
}

export type LevelItemProps = {
  hasTextCentered?: boolean
  children?: ReactNode
  className?: string
  dataTest?: string
}

export const LevelPropsEq: EqClass.Eq<LevelProps> = EqClass.struct<LevelProps>({
  children: EqClass.eqStrict,
  className: UndefinableEq(string.Eq),
  dataTest: UndefinableEq(string.Eq),
})

export const LevelItemPropsEq: EqClass.Eq<LevelItemProps> =
  EqClass.struct<LevelItemProps>({
    hasTextCentered: UndefinableEq(boolean.Eq),
    children: EqClass.eqStrict,
    className: UndefinableEq(string.Eq),
    dataTest: UndefinableEq(string.Eq),
  })
