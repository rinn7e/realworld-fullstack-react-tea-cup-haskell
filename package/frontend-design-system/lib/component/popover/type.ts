import { UndefinableEq } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as boolean from 'fp-ts/lib/boolean'
import * as string from 'fp-ts/lib/string'
import type React from 'react'

export type Alignment = 'left' | 'right'

export type Model = {
  readonly isOpen: boolean
}

export const ModelEq: EqClass.Eq<Model> = EqClass.struct({
  isOpen: boolean.Eq,
})

export type Msg =
  | { readonly _tag: 'NoOp' }
  | { readonly _tag: 'Toggle' }
  | { readonly _tag: 'Open' }
  | { readonly _tag: 'Close' }

export type PopoverProps = {
  model: Model
  dispatch: (msg: Msg) => void
  trigger: React.ReactNode
  children: React.ReactNode
  align?: Alignment
  className?: string
  cardClassName?: string
  dataTest?: string
}

export const PopoverPropsEq: EqClass.Eq<PopoverProps> =
  EqClass.struct<PopoverProps>({
    model: ModelEq,
    dispatch: EqClass.eqStrict,
    trigger: EqClass.eqStrict,
    children: EqClass.eqStrict,
    align: UndefinableEq(string.Eq),
    className: UndefinableEq(string.Eq),
    cardClassName: UndefinableEq(string.Eq),
    dataTest: UndefinableEq(string.Eq),
  })
