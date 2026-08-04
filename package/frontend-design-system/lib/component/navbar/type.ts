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

export type Model = {
  readonly openDropdownKey: string | null
}

export const ModelEq: EqClass.Eq<Model> = {
  equals: (x, y) => x.openDropdownKey === y.openDropdownKey,
}

export type Msg =
  | { readonly _tag: 'NoOp' }
  | { readonly _tag: 'ClickNavItem'; readonly item: NavItemData }
  | { readonly _tag: 'ToggleDropdown'; readonly key: string }
  | { readonly _tag: 'CloseDropdown' }

export type NavbarProps = {
  config: Config
  model: Model
  dispatch: (msg: Msg) => void
  className?: string
  containerClassName?: string
  key?: React.Key
  dataTest?: string
}

export const NavbarPropsEq: EqClass.Eq<NavbarProps> = EqClass.struct<
  Required<NavbarProps>
>({
  config: ConfigEq,
  model: ModelEq,
  dispatch: EqClass.eqStrict,
  className: string.Eq,
  containerClassName: string.Eq,
  key: EqClass.eqStrict,
  dataTest: string.Eq,
}) as unknown as EqClass.Eq<NavbarProps>
