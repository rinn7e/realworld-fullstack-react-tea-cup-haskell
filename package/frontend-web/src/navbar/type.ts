import type { NavItemData as DsNavItemData } from '@rinn7e/realworld-design-system/type/nav-item'
import type { Option } from 'fp-ts/lib/Option'

import type { User } from '@/common/api'
import type { Destination } from '@/common/type/destination'

export type NavLinkIcon =
  | { _tag: 'Icon'; name: 'pencil' | 'settings' }
  | { _tag: 'Avatar'; getImage: (user: Option<User>) => string | null }

export type NavLinkData = {
  key: string
  label: (user: Option<User>) => string
  destination: (user: Option<User>) => Destination
  screenTag: string
  icon?: NavLinkIcon
}

export type NavItem = {
  data: DsNavItemData
  destination?: Destination
}
