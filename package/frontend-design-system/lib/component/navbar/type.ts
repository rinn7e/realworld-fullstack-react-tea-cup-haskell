import * as EqClass from 'fp-ts/lib/Eq'
import * as string from 'fp-ts/lib/string'
import type React from 'react'

import { type NavItemData, NavItemDataEq } from '../../type/nav-item'

export type Config = {
  brandNavItem?: NavItemData
  desktopNavItems: NavItemData[]
  mobileNavItems: NavItemData[]
  unavailableMode?: boolean
}

export const ConfigEq: EqClass.Eq<Config> = {
  equals: (x, y) =>
    x.unavailableMode === y.unavailableMode &&
    ((!x.brandNavItem && !y.brandNavItem) ||
      (Boolean(x.brandNavItem) &&
        Boolean(y.brandNavItem) &&
        NavItemDataEq.equals(x.brandNavItem!, y.brandNavItem!))) &&
    x.desktopNavItems.length === y.desktopNavItems.length &&
    x.desktopNavItems.every((item, i) =>
      NavItemDataEq.equals(item, y.desktopNavItems[i]),
    ) &&
    x.mobileNavItems.length === y.mobileNavItems.length &&
    x.mobileNavItems.every((item, i) =>
      NavItemDataEq.equals(item, y.mobileNavItems[i]),
    ),
}

export type Model = null

export const ModelEq: EqClass.Eq<Model> = EqClass.eqStrict

export type Msg = { _tag: 'ClickNavItem'; item: NavItemData }

export type NavbarProps = {
  config: Config
  dispatch: (msg: Msg) => void
  className?: string
  containerClassName?: string
  endSlot?: React.ReactNode
  key?: React.Key
  dataTest?: string
}

export const NavbarPropsEq: EqClass.Eq<NavbarProps> = EqClass.struct<
  Required<NavbarProps>
>({
  config: ConfigEq,
  dispatch: EqClass.eqStrict,
  className: string.Eq,
  containerClassName: string.Eq,
  endSlot: EqClass.eqStrict,
  key: EqClass.eqStrict,
  dataTest: string.Eq,
}) as unknown as EqClass.Eq<NavbarProps>
