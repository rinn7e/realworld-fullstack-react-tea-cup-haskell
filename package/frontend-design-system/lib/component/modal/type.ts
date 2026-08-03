import * as EqClass from 'fp-ts/lib/Eq'
import type React from 'react'

export type Model = {
  isOpen: boolean
}

export const ModelEq: EqClass.Eq<Model> = EqClass.struct({
  isOpen: EqClass.eqBoolean,
})

export type Msg = { _tag: 'Open' } | { _tag: 'Close' }

export type ModalProps = {
  title?: string
  children: () => React.ReactNode
  footer?: React.ReactNode
  model: Model
  dispatch: (msg: Msg) => void
  className?: string
  key?: React.Key
  dataTest?: string
}

export const ModalPropsEq: EqClass.Eq<ModalProps> = EqClass.struct<
  Required<ModalProps>
>({
  title: EqClass.eqStrict,
  children: EqClass.eqStrict,
  footer: EqClass.eqStrict,
  model: ModelEq,
  dispatch: EqClass.eqStrict,
  className: EqClass.eqStrict,
  key: EqClass.eqStrict,
  dataTest: EqClass.eqStrict,
}) as unknown as EqClass.Eq<ModalProps>
