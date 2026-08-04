import * as EqClass from 'fp-ts/Eq'
import * as boolean from 'fp-ts/boolean'
import * as string from 'fp-ts/string'
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

export const LevelPropsEq: EqClass.Eq<LevelProps> = EqClass.struct<
  Required<LevelProps>
>({
  children: EqClass.eqStrict,
  className: string.Eq,
  dataTest: string.Eq,
}) as unknown as EqClass.Eq<LevelProps>

export const LevelItemPropsEq: EqClass.Eq<LevelItemProps> = EqClass.struct<
  Required<LevelItemProps>
>({
  hasTextCentered: boolean.Eq,
  children: EqClass.eqStrict,
  className: string.Eq,
  dataTest: string.Eq,
}) as unknown as EqClass.Eq<LevelItemProps>
