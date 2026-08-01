import type { Option } from 'fp-ts/lib/Option'

import type { User, UserWithToken } from '@/common/api/type'
import type * as DebugPanel from '@/component/debug-panel'
import type * as ArticlePage from '@/page/article/type'
import type * as EditorPage from '@/page/editor/type'
import type * as HomePage from '@/page/home/type'
import type * as LoginPage from '@/page/login/type'
import type * as ProfilePage from '@/page/profile/type'
import type * as SettingsPage from '@/page/settings/type'
import type * as SignupPage from '@/page/signup/type'

import { type Animate, type AnimateState } from './common/type/animate'
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
  route: AppRoute
  unavailableMode: boolean
  shared: Shared
  pageModel: PageModel
  isInternal: boolean
  debugPanel: DebugPanel.Model
  navbarMobileOpen: Animate<null>
}

export type Msg =
  | { _tag: 'NoOp' }
  | {
      _tag: 'Init'
      location: Location
      user: Option<User>
      isUnavailable: boolean
      token: Option<string>
    }
  | { _tag: 'UrlChange'; location: Location }
  | { _tag: 'ChangeRoute'; route: AppRoute }
  | { _tag: 'SetUser'; user: Option<UserWithToken> }
  | { _tag: 'HomePageMsg'; subMsg: HomePage.Msg }
  | { _tag: 'ArticlePageMsg'; subMsg: ArticlePage.Msg }
  | { _tag: 'LoginPageMsg'; subMsg: LoginPage.Msg }
  | { _tag: 'SignupPageMsg'; subMsg: SignupPage.Msg }
  | { _tag: 'SettingsPageMsg'; subMsg: SettingsPage.Msg }
  | { _tag: 'ProfilePageMsg'; subMsg: ProfilePage.Msg }
  | { _tag: 'EditorPageMsg'; subMsg: EditorPage.Msg }
  | { _tag: 'DebugPanelMsg'; subMsg: DebugPanel.Msg }
  | { _tag: 'ToggleNavbarMobile'; open: boolean }
  | { _tag: 'SetNavbarMobileState'; state: AnimateState }
