import type * as DsNavbar from '@rinn7e/realworld-design-system/component/navbar'
import { Menu } from 'lucide-react'

import {
  type Destination,
  homeScreen,
  toUrlString,
} from '@/common/type/destination'
import { ALL_COLOR_SCHEMES, formatColorSchemeLabel } from '@/theme/type'
import type { Model } from '@/type'

import { ColorSchemeIconMemo, NavLinkIconMemo } from './component'
import { navLinkAuths, navLinkUnauths } from './constant'
import type { NavItem } from './type'

export const toBrandNavItem = (_model: Model): NavItem => {
  const destination: Destination = { screen: homeScreen() }
  return {
    data: {
      key: 'site-logo',
      label: 'conduit',
      href: toUrlString(destination),
      isActive: false,
    },
    destination,
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
  const screenTag = model.screenModel._tag
  const navLinksData = userOpt._tag === 'Some' ? navLinkAuths : navLinkUnauths

  const items: NavItem[] = navLinksData.map((linkData) => {
    const destination = linkData.destination(userOpt)
    return {
      data: {
        key: linkData.key,
        label: linkData.label(userOpt),
        href: toUrlString(destination),
        isActive: screenTag === linkData.screenTag,
        icon: linkData.icon && (
          <NavLinkIconMemo icon={linkData.icon} user={userOpt} />
        ),
      },
      destination,
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

export const findNavItemDestination = (
  model: Model,
  itemKey: string,
): Destination | null => {
  const brand = toBrandNavItem(model)
  const found = toDesktopNavItems(model).find((n) => n.data.key === itemKey)
  if (brand.data.key === itemKey && brand.destination) {
    return brand.destination
  } else if (found && found.destination) {
    return found.destination
  } else {
    return null
  }
}
