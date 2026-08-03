import * as EqClass from 'fp-ts/lib/Eq'
import type { ReactNode } from 'react'

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
