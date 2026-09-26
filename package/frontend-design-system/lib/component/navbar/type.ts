import { NullableEq, UndefinableEq } from '@rinn7e/tea-cup-prelude'
import * as A from 'fp-ts/lib/Array'
import * as EqClass from 'fp-ts/lib/Eq'
import * as boolean from 'fp-ts/lib/boolean'
import * as string from 'fp-ts/lib/string'

import { type NavItemData, NavItemDataEq } from '../../type/nav-item'

export type Config = {
  brandNavItem?: NavItemData
  desktopNavItems: NavItemData[]
  mobileNavItems: NavItemData[]
  unavailableMode?: boolean
}

export const ConfigEq: EqClass.Eq<Config> = EqClass.struct<Config>({
  brandNavItem: UndefinableEq(NavItemDataEq),
  desktopNavItems: A.getEq(NavItemDataEq),
  mobileNavItems: A.getEq(NavItemDataEq),
  unavailableMode: UndefinableEq(boolean.Eq),
})

export type Model = {
  readonly openDropdownKey: string | null
}

export const ModelEq: EqClass.Eq<Model> = EqClass.struct({
  openDropdownKey: NullableEq(string.Eq),
})

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
  dataTest?: string
}

export const NavbarPropsEq: EqClass.Eq<NavbarProps> =
  EqClass.struct<NavbarProps>({
    config: ConfigEq,
    model: ModelEq,
    dispatch: EqClass.eqStrict,
    className: UndefinableEq(string.Eq),
    containerClassName: UndefinableEq(string.Eq),
    dataTest: UndefinableEq(string.Eq),
  })

export type NavItemProps = {
  item: NavItemData
  model: Model
  dispatch: (msg: Msg) => void
}

export const NavItemPropsEq: EqClass.Eq<NavItemProps> = EqClass.struct({
  item: NavItemDataEq,
  model: ModelEq,
  dispatch: EqClass.eqStrict,
})
