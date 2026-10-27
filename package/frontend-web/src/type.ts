import type * as DsFloatingSidebar from '@rinn7e/realworld-design-system/component/floating-sidebar'
import type * as DsNavbar from '@rinn7e/realworld-design-system/component/navbar'
import type * as TeaRouter from '@rinn7e/tea-cup-router'
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

import { type AppRoute } from './common/type/route'
import { type Shared } from './common/type/shared'

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
  router: TeaRouter.Model<AppRoute, ScreenModel>
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
  | { _tag: 'TeaRouterMsg'; subMsg: TeaRouter.Msg<AppRoute> }
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

export const teaRouterMsg = (subMsg: TeaRouter.Msg<AppRoute>): Msg => ({
  _tag: 'TeaRouterMsg',
  subMsg,
})
