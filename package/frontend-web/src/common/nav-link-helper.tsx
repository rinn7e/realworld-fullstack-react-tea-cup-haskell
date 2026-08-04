import type * as DsNavbar from '@rinn7e/realworld-design-system/component/navbar'
import { ImageMemo as DsImageMemo } from '@rinn7e/realworld-design-system/element/image/component'
import type { NavItemData as DsNavItemData } from '@rinn7e/realworld-design-system/type/nav-item'
import type { Option } from 'fp-ts/lib/Option'
import { Menu, Pencil, Settings } from 'lucide-react'
import React from 'react'

import type { User } from '@/common/api'
import { type AppRoute, homePage, toUrlString } from '@/common/type/route'
import type { Model } from '@/type'

import { type NavLinkIcon, navLinkAuths, navLinkUnauths } from './nav-link'

export type NavItem = {
  data: DsNavItemData
  route?: AppRoute
}

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

export const toBrandNavItem = (_model: Model): NavItem => {
  const route: AppRoute = { page: homePage() }
  return {
    data: {
      key: 'site-logo',
      label: 'conduit',
      href: toUrlString(route),
      isActive: false,
    },
    route,
  }
}

export const toMobileNavItems = (_model: Model): NavItem[] => [
  {
    data: {
      key: 'toggle-sidebar',
      label: '',
      href: '',
      isActive: false,
      icon: <Menu size={24} />,
    },
  },
]

export const toDesktopNavItems = (model: Model): NavItem[] => {
  const userOpt = model.shared.user
  const pageTag = model.pageModel._tag
  const navLinksData = userOpt._tag === 'Some' ? navLinkAuths : navLinkUnauths

  return navLinksData.map((linkData) => {
    const route = linkData.route(userOpt)
    return {
      data: {
        key: linkData.key,
        label: linkData.label(userOpt),
        href: toUrlString(route),
        isActive: pageTag === linkData.pageTag,
        icon: renderNavLinkIcon(linkData.icon, userOpt),
      },
      route,
    }
  })
}

export const toNavbarConfig = (model: Model): DsNavbar.Config => {
  const brand = toBrandNavItem(model)
  const desktop = toDesktopNavItems(model)
  const mobile = toMobileNavItems(model)

  return {
    brandNavItem: brand.data,
    desktopNavItems: desktop.map((n) => n.data),
    mobileNavItems: mobile.map((n) => n.data),
    unavailableMode: model.unavailableMode,
  }
}

export const findNavItemRoute = (
  model: Model,
  itemKey: string,
): AppRoute | null => {
  const brand = toBrandNavItem(model)
  if (brand.data.key === itemKey && brand.route) return brand.route

  const desktop = toDesktopNavItems(model)
  const found = desktop.find((n) => n.data.key === itemKey)
  if (found && found.route) return found.route

  return null
}
