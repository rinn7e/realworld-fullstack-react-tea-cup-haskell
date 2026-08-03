import * as A from 'fp-ts/lib/Array'
import * as EqClass from 'fp-ts/lib/Eq'
import * as string from 'fp-ts/lib/string'
import type React from 'react'

import * as Animate from '../../type/animate'
import { NavItemDataEq, type NavItemData } from '../../type/nav-item'

export type Model = {
  status: Animate.Animate<null>
}

export const ModelEq: EqClass.Eq<Model> = EqClass.struct({
  status: Animate.getEq(EqClass.eqStrict),
})

export type Msg =
  | { _tag: 'Toggle'; open: boolean }
  | { _tag: 'SetState'; state: Animate.AnimateState }
  | { _tag: 'ClickItem'; item: NavItemData }

export type SidebarProps = {
  model: Model
  items: NavItemData[]
  dispatch: (msg: Msg) => void
  placement?: 'left' | 'right'
  className?: string
  key?: React.Key
  dataTest?: string
}

export const SidebarPropsEq: EqClass.Eq<SidebarProps> = EqClass.struct<
  Required<SidebarProps>
>({
  model: ModelEq,
  items: A.getEq(NavItemDataEq),
  dispatch: EqClass.eqStrict,
  placement: string.Eq,
  className: string.Eq,
  key: EqClass.eqStrict,
  dataTest: string.Eq,
}) as unknown as EqClass.Eq<SidebarProps>
