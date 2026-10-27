import * as O from 'fp-ts/lib/Option'

import { homeScreen } from '@/common/type/destination'
import { assetPath } from '@/common/util'

import type { NavLinkData } from './type'

export const navLinkUnauths: NavLinkData[] = [
  {
    key: 'home',
    label: () => 'Home',
    destination: () => ({ screen: homeScreen() }),
    screenTag: 'HomeScreenModel',
  },
  {
    key: 'login',
    label: () => 'Sign in',
    destination: () => ({ screen: { _tag: 'LoginScreen' } }),
    screenTag: 'LoginScreenModel',
  },
  {
    key: 'signup',
    label: () => 'Sign up',
    destination: () => ({ screen: { _tag: 'SignupScreen' } }),
    screenTag: 'SignupScreenModel',
  },
]

export const navLinkAuths: NavLinkData[] = [
  {
    key: 'home',
    label: () => 'Home',
    destination: () => ({ screen: homeScreen() }),
    screenTag: 'HomeScreenModel',
  },
  {
    key: 'editor',
    label: () => 'New Article',
    destination: () => ({ screen: { _tag: 'EditorScreen', slug: O.none } }),
    screenTag: 'EditorScreenModel',
    icon: { _tag: 'Icon', name: 'pencil' },
  },
  {
    key: 'settings',
    label: () => 'Settings',
    destination: () => ({ screen: { _tag: 'SettingsScreen' } }),
    screenTag: 'SettingsScreenModel',
    icon: { _tag: 'Icon', name: 'settings' },
  },
  {
    key: 'profile',
    label: (userOpt) => (userOpt._tag === 'Some' ? userOpt.value.username : ''),
    destination: (userOpt) =>
      userOpt._tag === 'Some'
        ? {
            screen: {
              _tag: 'ProfileScreen',
              username: userOpt.value.username,
              favorites: false,
            },
          }
        : { screen: homeScreen() },
    screenTag: 'ProfileScreenModel',
    icon: {
      _tag: 'Avatar',
      getImage: (userOpt) =>
        userOpt._tag === 'Some' && userOpt.value.image
          ? assetPath(userOpt.value.image)
          : null,
    },
  },
]
