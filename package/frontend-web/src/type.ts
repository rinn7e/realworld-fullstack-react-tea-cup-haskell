import type * as DsFloatingSidebar from '@rinn7e/realworld-design-system/component/floating-sidebar'
import type * as DsNavbar from '@rinn7e/realworld-design-system/component/navbar'
import * as O from 'fp-ts/lib/Option'
import type { Option } from 'fp-ts/lib/Option'

import type { User, UserWithToken } from '@/common/api'
import type * as DebugPanel from '@/component/debug-panel'
import type * as ArticleScreen from '@/screen/article-screen'
import type * as EditorScreen from '@/screen/editor-screen'
import type * as HomeScreen from '@/screen/home-screen'
import type * as LoginScreen from '@/screen/login-screen'
import type * as ProfileScreen from '@/screen/profile-screen'
import type * as SettingsScreen from '@/screen/settings-screen'
import type * as SignupScreen from '@/screen/signup-screen'
import type { ColorScheme } from '@/theme/type'

import { type NavigationMsg, type Screen } from './common/type/destination'
import { type Shared } from './common/type/shared'

// The screen shown, as its model. Its tag and its own fields (a slug, the
// home tab and page, the profile username) are the destination's screen
// (`currentScreenOf`): a `currentScreen` field next to it would say the
// same thing twice.
export type ScreenModel =
  | { _tag: 'HomeScreenModel'; model: HomeScreen.Model }
  | { _tag: 'ArticleScreenModel'; model: ArticleScreen.Model }
  | { _tag: 'LoginScreenModel'; model: LoginScreen.Model }
  | { _tag: 'SignupScreenModel'; model: SignupScreen.Model }
  | { _tag: 'SettingsScreenModel'; model: SettingsScreen.Model }
  | { _tag: 'ProfileScreenModel'; model: ProfileScreen.Model }
  | { _tag: 'EditorScreenModel'; model: EditorScreen.Model }
  | { _tag: 'NotFoundScreenModel' }

export type Model = {
  screenModel: ScreenModel
  unavailableMode: boolean
  shared: Shared
  debugPanel: DebugPanel.Model
  sidebar: DsFloatingSidebar.Model
  navbar: DsNavbar.Model
  colorScheme: ColorScheme
}

export type Msg =
  | { _tag: 'NoOp' }
  | { _tag: 'ChangeColorScheme'; scheme: ColorScheme }
  | {
      _tag: 'Init'
      location: Location
      user: Option<User>
      isUnavailable: boolean
      token: Option<string>
    }
  | { _tag: 'NavigationMsg'; subMsg: NavigationMsg }
  | { _tag: 'SetUser'; user: Option<UserWithToken> }
  | { _tag: 'HomeScreenMsg'; subMsg: HomeScreen.Msg }
  | { _tag: 'ArticleScreenMsg'; subMsg: ArticleScreen.Msg }
  | { _tag: 'LoginScreenMsg'; subMsg: LoginScreen.Msg }
  | { _tag: 'SignupScreenMsg'; subMsg: SignupScreen.Msg }
  | { _tag: 'SettingsScreenMsg'; subMsg: SettingsScreen.Msg }
  | { _tag: 'ProfileScreenMsg'; subMsg: ProfileScreen.Msg }
  | { _tag: 'EditorScreenMsg'; subMsg: EditorScreen.Msg }
  | { _tag: 'DebugPanelMsg'; subMsg: DebugPanel.Msg }
  | { _tag: 'SidebarMsg'; subMsg: DsFloatingSidebar.Msg }
  | { _tag: 'NavbarMsg'; subMsg: DsNavbar.Msg }

// The screen shown (the destination's `screen`, `destinationOf`), read
// from the fields of its model that hold the screen's params
export const currentScreenOf = (screenModel: ScreenModel): Screen => {
  switch (screenModel._tag) {
    case 'HomeScreenModel':
      return {
        _tag: 'HomeScreen',
        tab: screenModel.model.tab,
        page: screenModel.model.pagination.page,
      }
    case 'ArticleScreenModel':
      return { _tag: 'ArticleScreen', slug: screenModel.model.slug }
    case 'LoginScreenModel':
      return { _tag: 'LoginScreen' }
    case 'SignupScreenModel':
      return { _tag: 'SignupScreen' }
    case 'SettingsScreenModel':
      return { _tag: 'SettingsScreen' }
    case 'ProfileScreenModel':
      return {
        _tag: 'ProfileScreen',
        username: screenModel.model.username,
        favorites: screenModel.model.showFavorites,
      }
    case 'EditorScreenModel':
      return {
        _tag: 'EditorScreen',
        slug: O.fromNullable(screenModel.model.slug),
      }
    case 'NotFoundScreenModel':
      return { _tag: 'NotFoundScreen' }
  }
}

// Widens a screen's model to `ScreenModel` (an object literal keeps its own
// tag, which narrows the `Model` built from it)
export const withScreenModel = (
  model: Model,
  screenModel: ScreenModel,
): Model => ({ ...model, screenModel })
