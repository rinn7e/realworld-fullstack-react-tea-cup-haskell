import * as A from 'fp-ts/lib/Array'
import * as boolean from 'fp-ts/lib/boolean'
import * as EqClass from 'fp-ts/lib/Eq'
import * as string from 'fp-ts/lib/string'
import type React from 'react'

import { NavItemDataEq, type NavItemData } from '../../type/nav-item'

export type SidebarCategory = {
  title: string
  items: NavItemData[]
}

export const SidebarCategoryEq: EqClass.Eq<SidebarCategory> = EqClass.struct({
  title: string.Eq,
  items: A.getEq(NavItemDataEq),
})

export type Model = {
  collapsed: boolean
}

export const ModelEq: EqClass.Eq<Model> = EqClass.struct({
  collapsed: boolean.Eq,
})

export type Msg =
  | { _tag: 'ToggleCollapsed' }
  | { _tag: 'SetCollapsed'; collapsed: boolean }
  | { _tag: 'ClickItem'; item: NavItemData }

export type SidebarProps = {
  model: Model
  items?: NavItemData[]
  categories?: SidebarCategory[]
  dispatch: (msg: Msg) => void
  brandTitle?: string
  brandLogo?: React.ReactNode
  userProfile?: {
    name: string
    subtitle?: string
    avatar?: React.ReactNode
  }
  align?: 'left' | 'right'
  className?: string
  key?: React.Key
  dataTest?: string
}

export const SidebarPropsEq: EqClass.Eq<SidebarProps> = EqClass.struct<
  Required<SidebarProps>
>({
  model: ModelEq,
  items: A.getEq(NavItemDataEq),
  categories: A.getEq(SidebarCategoryEq),
  dispatch: EqClass.eqStrict,
  brandTitle: string.Eq,
  brandLogo: EqClass.eqStrict,
  userProfile: EqClass.eqStrict,
  align: string.Eq,
  className: string.Eq,
  key: EqClass.eqStrict,
  dataTest: string.Eq,
}) as unknown as EqClass.Eq<SidebarProps>
