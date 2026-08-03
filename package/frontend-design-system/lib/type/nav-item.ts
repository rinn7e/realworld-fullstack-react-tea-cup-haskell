import * as boolean from 'fp-ts/lib/boolean'
import * as EqClass from 'fp-ts/lib/Eq'
import * as string from 'fp-ts/lib/string'
import type { ReactNode } from 'react'

export type NavItemData = {
  key: string
  label: string
  href: string
  isActive: boolean
  icon?: ReactNode
  isNewTab?: boolean
}

export const NavItemDataEq: EqClass.Eq<NavItemData> = EqClass.struct<
  Required<NavItemData>
>({
  key: string.Eq,
  label: string.Eq,
  href: string.Eq,
  isActive: boolean.Eq,
  icon: EqClass.eqStrict,
  isNewTab: boolean.Eq,
}) as unknown as EqClass.Eq<NavItemData>
