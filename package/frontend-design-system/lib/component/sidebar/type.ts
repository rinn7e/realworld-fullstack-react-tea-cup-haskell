import { UndefinableEq } from '@rinn7e/tea-cup-prelude'
import * as A from 'fp-ts/lib/Array'
import * as EqClass from 'fp-ts/lib/Eq'
import * as RA from 'fp-ts/lib/ReadonlyArray'
import * as boolean from 'fp-ts/lib/boolean'
import * as number from 'fp-ts/lib/number'
import * as string from 'fp-ts/lib/string'
import type React from 'react'

import { type NavItemData, NavItemDataEq } from '../../type/nav-item'

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
  expandedKeys: ReadonlyArray<string>
}

export const ModelEq: EqClass.Eq<Model> = EqClass.struct<Model>({
  collapsed: boolean.Eq,
  expandedKeys: RA.getEq(string.Eq),
})

export type Msg =
  | { _tag: 'ToggleCollapsed' }
  | { _tag: 'SetCollapsed'; collapsed: boolean }
  | { _tag: 'ToggleExpand'; key: string }
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
  dataTest?: string
}

export const SidebarPropsEq: EqClass.Eq<SidebarProps> =
  EqClass.struct<SidebarProps>({
    model: ModelEq,
    items: UndefinableEq(A.getEq(NavItemDataEq)),
    categories: UndefinableEq(A.getEq(SidebarCategoryEq)),
    dispatch: EqClass.eqStrict,
    brandTitle: UndefinableEq(string.Eq),
    brandLogo: EqClass.eqStrict,
    userProfile: EqClass.eqStrict,
    align: UndefinableEq(string.Eq),
    className: UndefinableEq(string.Eq),
    dataTest: UndefinableEq(string.Eq),
  })

export type SidebarItemProps = {
  item: NavItemData
  depth: number
  isCollapsed: boolean
  expandedKeys: ReadonlyArray<string>
  dispatch: (msg: Msg) => void
}

export const SidebarItemPropsEq: EqClass.Eq<SidebarItemProps> = EqClass.struct({
  item: NavItemDataEq,
  depth: number.Eq,
  isCollapsed: boolean.Eq,
  expandedKeys: RA.getEq(string.Eq),
  dispatch: EqClass.eqStrict,
})
