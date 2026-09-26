import type * as DsFloatingSidebar from '@rinn7e/realworld-design-system/component/floating-sidebar'
import type * as DsNavbar from '@rinn7e/realworld-design-system/component/navbar'
import type * as TeaRouter from '@rinn7e/tea-cup-router'
import type { Option } from 'fp-ts/lib/Option'

import type { User, UserWithToken } from '@/common/api'
import type * as DebugPanel from '@/component/debug-panel'
import type * as ArticlePage from '@/page/article'
import type * as EditorPage from '@/page/editor'
import type * as HomePage from '@/page/home'
import type * as LoginPage from '@/page/login'
import type * as ProfilePage from '@/page/profile'
import type * as SettingsPage from '@/page/settings'
import type * as SignupPage from '@/page/signup'
import type { ColorScheme } from '@/theme/type'

import { type AppRoute } from './common/type/route'
import { type Shared } from './common/type/shared'

export type PageModel =
  | { _tag: 'HomePageModel'; model: HomePage.Model }
  | { _tag: 'ArticlePageModel'; model: ArticlePage.Model }
  | { _tag: 'LoginPageModel'; model: LoginPage.Model }
  | { _tag: 'SignupPageModel'; model: SignupPage.Model }
  | { _tag: 'SettingsPageModel'; model: SettingsPage.Model }
  | { _tag: 'ProfilePageModel'; model: ProfilePage.Model }
  | { _tag: 'EditorPageModel'; model: EditorPage.Model }
  | { _tag: 'NotFoundPageModel' }

export type Model = {
  router: TeaRouter.Model<AppRoute, PageModel>
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
  | { _tag: 'HomePageMsg'; subMsg: HomePage.Msg }
  | { _tag: 'ArticlePageMsg'; subMsg: ArticlePage.Msg }
  | { _tag: 'LoginPageMsg'; subMsg: LoginPage.Msg }
  | { _tag: 'SignupPageMsg'; subMsg: SignupPage.Msg }
  | { _tag: 'SettingsPageMsg'; subMsg: SettingsPage.Msg }
  | { _tag: 'ProfilePageMsg'; subMsg: ProfilePage.Msg }
  | { _tag: 'EditorPageMsg'; subMsg: EditorPage.Msg }
  | { _tag: 'DebugPanelMsg'; subMsg: DebugPanel.Msg }
  | { _tag: 'SidebarMsg'; subMsg: DsFloatingSidebar.Msg }
  | { _tag: 'NavbarMsg'; subMsg: DsNavbar.Msg }

export const teaRouterMsg = (subMsg: TeaRouter.Msg<AppRoute>): Msg => ({
  _tag: 'TeaRouterMsg',
  subMsg,
})
