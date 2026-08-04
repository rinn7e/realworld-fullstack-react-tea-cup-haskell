import * as EqClass from 'fp-ts/lib/Eq'
import * as boolean from 'fp-ts/lib/boolean'
import * as string from 'fp-ts/lib/string'
import type React from 'react'

export type Alignment = 'left' | 'right'

export type Model = {
  readonly isOpen: boolean
}

export const ModelEq: EqClass.Eq<Model> = {
  equals: (x, y) => boolean.Eq.equals(x.isOpen, y.isOpen),
}

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

export const PopoverPropsEq: EqClass.Eq<PopoverProps> = EqClass.struct<
  Required<PopoverProps>
>({
  model: ModelEq,
  dispatch: EqClass.eqStrict,
  trigger: EqClass.eqStrict,
  children: EqClass.eqStrict,
  align: string.Eq as unknown as EqClass.Eq<Alignment>,
  className: string.Eq,
  cardClassName: string.Eq,
  dataTest: string.Eq,
}) as unknown as EqClass.Eq<PopoverProps>
