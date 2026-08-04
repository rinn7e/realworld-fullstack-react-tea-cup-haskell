import * as EqClass from 'fp-ts/lib/Eq'
import * as boolean from 'fp-ts/lib/boolean'
import * as string from 'fp-ts/lib/string'
import type { ReactNode } from 'react'

export type NavItemData = {
  key: string
  label: string
  href?: string
  isActive: boolean
  icon?: ReactNode
  isNewTab?: boolean
  children?: NavItemData[]
}

export const NavItemDataEq: EqClass.Eq<NavItemData> = {
  equals: (x, y) =>
    string.Eq.equals(x.key, y.key) &&
    string.Eq.equals(x.label, y.label) &&
    x.href === y.href &&
    boolean.Eq.equals(x.isActive, y.isActive) &&
    x.icon === y.icon &&
    Boolean(x.isNewTab) === Boolean(y.isNewTab) &&
    ((!x.children && !y.children) ||
      (Boolean(x.children) &&
        Boolean(y.children) &&
        x.children!.length === y.children!.length &&
        x.children!.every((c, i) => NavItemDataEq.equals(c, y.children![i])))),
}
