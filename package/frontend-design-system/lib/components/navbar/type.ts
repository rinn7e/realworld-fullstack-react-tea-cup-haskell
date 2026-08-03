import type { Eq } from 'fp-ts/lib/Eq'
import type { Dispatcher } from 'tea-cup-fp'

import {
  EqAlways,
  type NavItemData,
  mkNavItemDataEq,
} from '../../common/nav-item'

export type Config<PMsg> = {
  brandNavItem?: NavItemData<PMsg>
  desktopNavItems: NavItemData<PMsg>[]
  mobileNavItems: NavItemData<PMsg>[]
  unavailableMode?: boolean
}

export const mkConfigEq = <PMsg>(msgEq: Eq<PMsg>): Eq<Config<PMsg>> => {
  const itemEq = mkNavItemDataEq(msgEq)
  return {
    equals: (x, y) =>
      x.unavailableMode === y.unavailableMode &&
      ((!x.brandNavItem && !y.brandNavItem) ||
        (Boolean(x.brandNavItem) &&
          Boolean(y.brandNavItem) &&
          itemEq.equals(x.brandNavItem!, y.brandNavItem!))) &&
      x.desktopNavItems.length === y.desktopNavItems.length &&
      x.desktopNavItems.every((item, i) =>
        itemEq.equals(item, y.desktopNavItems[i]),
      ) &&
      x.mobileNavItems.length === y.mobileNavItems.length &&
      x.mobileNavItems.every((item, i) =>
        itemEq.equals(item, y.mobileNavItems[i]),
      ),
  }
}

export const ConfigEq: Eq<Config<unknown>> = mkConfigEq(EqAlways)

export type Props<PMsg> = {
  config: Config<PMsg>
  dispatch: Dispatcher<PMsg>
}

export const mkPropsEq = <PMsg>(msgEq: Eq<PMsg>): Eq<Props<PMsg>> => {
  const configEq = mkConfigEq(msgEq)
  return {
    equals: (x, y) => configEq.equals(x.config, y.config),
  }
}

export const PropsEq: Eq<Props<unknown>> = mkPropsEq(EqAlways)
