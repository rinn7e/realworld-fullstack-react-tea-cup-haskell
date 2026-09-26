import type * as DsNavbar from '@rinn7e/realworld-design-system/component/navbar'
import * as TeaRouter from '@rinn7e/tea-cup-router'
import { Menu } from 'lucide-react'

import { type AppRoute, homePage, toUrlString } from '@/common/type/route'
import { ALL_COLOR_SCHEMES, formatColorSchemeLabel } from '@/theme/type'
import type { Model } from '@/type'

import { ColorSchemeIconMemo, NavLinkIconMemo } from './component'
import { navLinkAuths, navLinkUnauths } from './constant'
import type { NavItem } from './type'

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
  const pageTag = TeaRouter.getPageModel(model.router)._tag
  const navLinksData = userOpt._tag === 'Some' ? navLinkAuths : navLinkUnauths

  const items: NavItem[] = navLinksData.map((linkData) => {
    const route = linkData.route(userOpt)
    return {
      data: {
        key: linkData.key,
        label: linkData.label(userOpt),
        href: toUrlString(route),
        isActive: pageTag === linkData.pageTag,
        icon: linkData.icon && (
          <NavLinkIconMemo icon={linkData.icon} user={userOpt} />
        ),
      },
      route,
    }
  })

  items.push({
    data: {
      key: 'theme',
      label: '',
      isActive: false,
      icon: <ColorSchemeIconMemo scheme={model.colorScheme} size={18} />,
      children: ALL_COLOR_SCHEMES.map((scheme) => ({
        key: `theme-${scheme}`,
        label: formatColorSchemeLabel(scheme),
        isActive: model.colorScheme === scheme,
        icon: <ColorSchemeIconMemo scheme={scheme} size={16} />,
        shouldCloseOnSelect: false,
      })),
    },
  })

  return items
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
  const found = toDesktopNavItems(model).find((n) => n.data.key === itemKey)
  if (brand.data.key === itemKey && brand.route) {
    return brand.route
  } else if (found && found.route) {
    return found.route
  } else {
    return null
  }
}
