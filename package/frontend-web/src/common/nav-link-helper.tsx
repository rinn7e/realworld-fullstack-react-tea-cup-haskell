import { ImageMemo as DsImageMemo } from '@rinn7e/realworld-design-system/element/image/component'
import * as DsNavbar from '@rinn7e/realworld-design-system/component/navbar'
import type { Option } from 'fp-ts/lib/Option'
import { Menu, Pencil, Settings } from 'lucide-react'
import React from 'react'

import type { User } from '@/common/api'
import { homePage, toUrlString } from '@/common/type/route'
import type { NavItemData as DsNavItemData } from '@rinn7e/realworld-design-system/type/nav-item'
import type { Model, Msg } from '@/type'

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
      <DsImageMemo
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

export const toBrandNavItem = (_model: Model): DsNavItemData<Msg> => ({
  key: 'site-logo',
  label: 'conduit',
  href: toUrlString({ page: homePage() }),
  isActive: false,
  onClick: { _tag: 'ChangeRoute', route: { page: homePage() } },
})

export const toMobileNavItems = (_model: Model): DsNavItemData<Msg>[] => [
  {
    key: 'toggle-sidebar',
    label: '',
    href: '',
    isActive: false,
    onClick: {
      _tag: 'SidebarMsg',
      subMsg: { _tag: 'Toggle', open: true },
    },
    icon: <Menu size={24} />,
  },
]

export const toDesktopNavItems = (model: Model): DsNavItemData<Msg>[] => {
  const userOpt = model.shared.user
  const pageTag = model.pageModel._tag
  const navLinksData = userOpt._tag === 'Some' ? navLinkAuths : navLinkUnauths

  return navLinksData.map((linkData) => {
    const route = linkData.route(userOpt)
    return {
      key: linkData.key,
      label: linkData.label(userOpt),
      href: toUrlString(route),
      onClick: { _tag: 'ChangeRoute', route },
      isActive: pageTag === linkData.pageTag,
      icon: renderNavLinkIcon(linkData.icon, userOpt),
    }
  })
}

export const toNavbarConfig = (model: Model): DsNavbar.Config<Msg> => ({
  brandNavItem: toBrandNavItem(model),
  desktopNavItems: toDesktopNavItems(model),
  mobileNavItems: toMobileNavItems(model),
  unavailableMode: model.unavailableMode,
})
