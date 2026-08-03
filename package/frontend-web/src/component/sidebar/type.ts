import { EqAlways } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import type { ReactNode } from 'react'
import type { Dispatcher } from 'tea-cup-fp'

import * as Animate from '@/common/type/animate'
import type { AppRoute } from '@/common/type/route'

export type Model = {
  status: Animate.Animate<null>
}

export const ModelEq: EqClass.Eq<Model> = EqClass.struct({
  status: Animate.getEq(EqAlways),
})

export type Msg =
  | { _tag: 'Toggle'; open: boolean }
  | { _tag: 'SetState'; state: Animate.AnimateState }

export type SidebarItemData = {
  key: string
  label: string
  route: AppRoute
  isActive: boolean
  icon?: ReactNode
}

export const SidebarItemDataEq: EqClass.Eq<SidebarItemData> = {
  equals: (x, y) =>
    x.key === y.key && x.label === y.label && x.isActive === y.isActive,
}

export type Props = {
  model: Model
  dispatch: Dispatcher<Msg>
  items: SidebarItemData[]
}

export const PropsEq: EqClass.Eq<Props> = {
  equals: (x, y) =>
    ModelEq.equals(x.model, y.model) &&
    x.items.length === y.items.length &&
    x.items.every((item, i) => SidebarItemDataEq.equals(item, y.items[i])),
}
