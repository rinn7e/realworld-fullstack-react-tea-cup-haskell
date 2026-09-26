import type { NavItemData as DsNavItemData } from '@rinn7e/realworld-design-system/type/nav-item'
import type { Option } from 'fp-ts/lib/Option'

import type { User } from '@/common/api'
import type { AppRoute } from '@/common/type/route'

export type NavLinkIcon =
  | { _tag: 'Icon'; name: 'pencil' | 'settings' }
  | { _tag: 'Avatar'; getImage: (user: Option<User>) => string | null }

export type NavLinkData = {
  key: string
  label: (user: Option<User>) => string
  route: (user: Option<User>) => AppRoute
  pageTag: string
  icon?: NavLinkIcon
}

export type NavItem = {
  data: DsNavItemData
  route?: AppRoute
}
