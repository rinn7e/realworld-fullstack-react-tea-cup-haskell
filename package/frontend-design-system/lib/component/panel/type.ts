import * as A from 'fp-ts/lib/Array'
import * as EqClass from 'fp-ts/lib/Eq'
import type React from 'react'

export type PanelTab = {
  id: string
  label: string
}

export const PanelTabEq: EqClass.Eq<PanelTab> = EqClass.struct({
  id: EqClass.eqString,
  label: EqClass.eqString,
})

export type PanelBlockItem = {
  id: string
  label: React.ReactNode
  icon?: React.ReactNode
}

export const PanelBlockItemEq: EqClass.Eq<PanelBlockItem> = EqClass.struct<
  Required<PanelBlockItem>
>({
  id: EqClass.eqString,
  label: EqClass.eqStrict,
  icon: EqClass.eqStrict,
}) as unknown as EqClass.Eq<PanelBlockItem>

export type Model = {
  activeTabId: string
  selectedItemId: string | null
}

export const ModelEq: EqClass.Eq<Model> = EqClass.struct({
  activeTabId: EqClass.eqString,
  selectedItemId: EqClass.eqStrict,
})

export type Msg =
  { _tag: 'SelectTab'; id: string } | { _tag: 'SelectItem'; id: string }

export type PanelProps = {
  heading: React.ReactNode
  tabs?: PanelTab[]
  blocks: PanelBlockItem[]
  model: Model
  dispatch: (msg: Msg) => void
  className?: string
  key?: React.Key
  dataTest?: string
}

export const PanelPropsEq: EqClass.Eq<PanelProps> = EqClass.struct<
  Required<PanelProps>
>({
  heading: EqClass.eqStrict,
  tabs: EqClass.eqStrict,
  blocks: A.getEq(PanelBlockItemEq),
  model: ModelEq,
  dispatch: EqClass.eqStrict,
  className: EqClass.eqStrict,
  key: EqClass.eqStrict,
  dataTest: EqClass.eqStrict,
}) as unknown as EqClass.Eq<PanelProps>
