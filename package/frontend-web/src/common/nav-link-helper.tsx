import { Image } from '@rinn7e/realworld-design-system'
import type { Option } from 'fp-ts/lib/Option'
import { Pencil, Settings } from 'lucide-react'
import React from 'react'

import type { User } from '@/common/api'
import type { SidebarItemData } from '@/component/sidebar'
import type { Model } from '@/type'

import {
  type NavLinkIcon,
  navLinkAuths,
  navLinkUnauths,
} from './nav-link'

export const renderNavLinkIcon = (
  icon?: NavLinkIcon,
  userOpt?: Option<User>,
) => {
  if (!icon) return null
  if (icon._tag === 'Icon') {
    if (icon.name === 'pencil') return <Pencil size={14} />
    if (icon.name === 'settings') return <Settings size={14} />
  }
  if (icon._tag === 'Avatar' && userOpt) {
    return (
      <Image.View
        src={icon.getImage(userOpt)}
        defaultSrc='/default-avatar.svg'
        className='h-[28px] w-[28px] rounded-full object-cover'
        alt=''
        dataTest='navbar-user-avatar'
      />
    )
  }
  return null
}

export const toSidebarItems = (model: Model): SidebarItemData[] => {
  const userOpt = model.shared.user
  const pageTag = model.pageModel._tag
  const navLinksData = userOpt._tag === 'Some' ? navLinkAuths : navLinkUnauths

  return navLinksData.map((linkData) => ({
    key: linkData.key,
    label: linkData.label(userOpt),
    route: linkData.route(userOpt),
    isActive: pageTag === linkData.pageTag,
    icon: renderNavLinkIcon(linkData.icon, userOpt),
  }))
}
