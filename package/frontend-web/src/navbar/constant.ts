import * as O from 'fp-ts/lib/Option'

import { pageHome } from '@/common/type/route'
import { assetPath } from '@/common/util'

import type { NavLinkData } from './type'

export const navLinkUnauths: NavLinkData[] = [
  {
    key: 'home',
    label: () => 'Home',
    route: () => ({ page: pageHome() }),
    pageTag: 'HomeScreenModel',
  },
  {
    key: 'login',
    label: () => 'Sign in',
    route: () => ({ page: { _tag: 'PageLogin' } }),
    pageTag: 'LoginScreenModel',
  },
  {
    key: 'signup',
    label: () => 'Sign up',
    route: () => ({ page: { _tag: 'PageSignup' } }),
    pageTag: 'SignupScreenModel',
  },
]

export const navLinkAuths: NavLinkData[] = [
  {
    key: 'home',
    label: () => 'Home',
    route: () => ({ page: pageHome() }),
    pageTag: 'HomeScreenModel',
  },
  {
    key: 'editor',
    label: () => 'New Article',
    route: () => ({ page: { _tag: 'PageEditor', slug: O.none } }),
    pageTag: 'EditorScreenModel',
    icon: { _tag: 'Icon', name: 'pencil' },
  },
  {
    key: 'settings',
    label: () => 'Settings',
    route: () => ({ page: { _tag: 'PageSettings' } }),
    pageTag: 'SettingsScreenModel',
    icon: { _tag: 'Icon', name: 'settings' },
  },
  {
    key: 'profile',
    label: (userOpt) => (userOpt._tag === 'Some' ? userOpt.value.username : ''),
    route: (userOpt) =>
      userOpt._tag === 'Some'
        ? {
            page: {
              _tag: 'PageProfile',
              username: userOpt.value.username,
              favorites: false,
            },
          }
        : { page: pageHome() },
    pageTag: 'ProfileScreenModel',
    icon: {
      _tag: 'Avatar',
      getImage: (userOpt) =>
        userOpt._tag === 'Some' && userOpt.value.image
          ? assetPath(userOpt.value.image)
          : null,
    },
  },
]
