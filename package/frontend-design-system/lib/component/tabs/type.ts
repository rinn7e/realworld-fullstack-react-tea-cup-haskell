import * as A from 'fp-ts/lib/Array'
import * as EqClass from 'fp-ts/lib/Eq'
import type React from 'react'

export type TabItem = {
  id: string
  label: React.ReactNode
  icon?: React.ReactNode
}

export const TabItemEq: EqClass.Eq<TabItem> = EqClass.struct<TabItem>({
  id: EqClass.eqString,
  label: EqClass.eqStrict,
  icon: EqClass.eqStrict,
})

export type Model = {
  activeId: string
}

export const ModelEq: EqClass.Eq<Model> = EqClass.struct({
  activeId: EqClass.eqString,
})

export type Msg = { _tag: 'Select'; id: string }

export type TabsProps = {
  items: TabItem[]
  model: Model
  dispatch: (msg: Msg) => void
  isBoxed?: boolean
  isToggle?: boolean
  isFullWidth?: boolean
  className?: string
  dataTest?: string
}

export const TabsPropsEq: EqClass.Eq<TabsProps> = EqClass.struct<TabsProps>({
  items: A.getEq(TabItemEq),
  model: ModelEq,
  dispatch: EqClass.eqStrict,
  isBoxed: EqClass.eqStrict,
  isToggle: EqClass.eqStrict,
  isFullWidth: EqClass.eqStrict,
  className: EqClass.eqStrict,
  dataTest: EqClass.eqStrict,
})
