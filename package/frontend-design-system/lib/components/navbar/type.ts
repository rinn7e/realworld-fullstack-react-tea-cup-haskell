import * as EqClass from 'fp-ts/lib/Eq'
import type { ReactNode } from 'react'
import type { Dispatcher } from 'tea-cup-fp'

export type NavItemData<PMsg> = {
  key: string
  label: string
  href: string
  isActive: boolean
  onClick: PMsg
  icon?: ReactNode
}

export const mkNavItemDataEq = <PMsg>(
  msgEq: EqClass.Eq<PMsg>,
): EqClass.Eq<NavItemData<PMsg>> => ({
  equals: (x, y) =>
    x.key === y.key &&
    x.label === y.label &&
    x.href === y.href &&
    x.isActive === y.isActive &&
    msgEq.equals(x.onClick, y.onClick),
})

export const EqAlways: EqClass.Eq<unknown> = {
  equals: () => true,
}

export const NavItemDataEq: EqClass.Eq<NavItemData<unknown>> =
  mkNavItemDataEq(EqAlways)

export type Model<PMsg> = {
  brandNavItem?: NavItemData<PMsg>
  desktopNavItems: NavItemData<PMsg>[]
  mobileNavItems: NavItemData<PMsg>[]
  unavailableMode?: boolean
}

export const mkModelEq = <PMsg>(
  msgEq: EqClass.Eq<PMsg>,
): EqClass.Eq<Model<PMsg>> => {
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

export const ModelEq: EqClass.Eq<Model<unknown>> = mkModelEq(EqAlways)

export type Props<PMsg> = {
  model: Model<PMsg>
  dispatch: Dispatcher<PMsg>
}

export const mkPropsEq = <PMsg>(
  msgEq: EqClass.Eq<PMsg>,
): EqClass.Eq<Props<PMsg>> => {
  const modelEq = mkModelEq(msgEq)
  return {
    equals: (x, y) => modelEq.equals(x.model, y.model),
  }
}

export const PropsEq: EqClass.Eq<Props<unknown>> = mkPropsEq(EqAlways)
