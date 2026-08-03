import * as O from 'fp-ts/lib/Option'
import type { Option } from 'fp-ts/lib/Option'

import type { User } from '@/common/api'
import type { AppRoute } from '@/common/type/route'
import { homePage } from '@/common/type/route'
import { assetPath } from '@/common/util'

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

export const navLinkUnauths: NavLinkData[] = [
  {
    key: 'home',
    label: () => 'Home',
    route: () => ({ page: homePage() }),
    pageTag: 'HomePageModel',
  },
  {
    key: 'login',
    label: () => 'Sign in',
    route: () => ({ page: { _tag: 'LoginPage' } }),
    pageTag: 'LoginPageModel',
  },
  {
    key: 'signup',
    label: () => 'Sign up',
    route: () => ({ page: { _tag: 'SignupPage' } }),
    pageTag: 'SignupPageModel',
  },
]

export const navLinkAuths: NavLinkData[] = [
  {
    key: 'home',
    label: () => 'Home',
    route: () => ({ page: homePage() }),
    pageTag: 'HomePageModel',
  },
  {
    key: 'editor',
    label: () => 'New Article',
    route: () => ({ page: { _tag: 'EditorPage', slug: O.none } }),
    pageTag: 'EditorPageModel',
    icon: { _tag: 'Icon', name: 'pencil' },
  },
  {
    key: 'settings',
    label: () => 'Settings',
    route: () => ({ page: { _tag: 'SettingsPage' } }),
    pageTag: 'SettingsPageModel',
    icon: { _tag: 'Icon', name: 'settings' },
  },
  {
    key: 'profile',
    label: (userOpt) =>
      userOpt._tag === 'Some' ? userOpt.value.username : '',
    route: (userOpt) =>
      userOpt._tag === 'Some'
        ? {
            page: {
              _tag: 'ProfilePage',
              username: userOpt.value.username,
              favorites: false,
            },
          }
        : { page: homePage() },
    pageTag: 'ProfilePageModel',
    icon: {
      _tag: 'Avatar',
      getImage: (userOpt) =>
        userOpt._tag === 'Some' && userOpt.value.image
          ? assetPath(userOpt.value.image)
          : null,
    },
  },
]
