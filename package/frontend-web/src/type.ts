import type * as DsFloatingSidebar from '@rinn7e/realworld-design-system/component/floating-sidebar'
import type * as DsNavbar from '@rinn7e/realworld-design-system/component/navbar'
import * as O from 'fp-ts/lib/Option'
import type { Option } from 'fp-ts/lib/Option'

import type { User, UserWithToken } from '@/common/api'
import type * as DebugPanel from '@/component/debug-panel'
import type * as ArticlePage from '@/page/article-page'
import type * as EditorPage from '@/page/editor-page'
import type * as HomePage from '@/page/home-page'
import type * as LoginPage from '@/page/login-page'
import type * as ProfilePage from '@/page/profile-page'
import type * as SettingsPage from '@/page/settings-page'
import type * as SignupPage from '@/page/signup-page'
import type { ColorScheme } from '@/theme/type'

import {
  type AppRoute,
  pageArticle,
  pageEditor,
  pageHome,
  pageLogin,
  pageNotFound,
  pageProfile,
  pageSettings,
  pageSignup,
} from './common/type/route'
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

// Every route param lives in its page model, so the open page alone gives the
// route
export const pageModelToRoute = (pageModel: PageModel): AppRoute => {
  switch (pageModel._tag) {
    case 'HomePageModel':
      return {
        page: pageHome(pageModel.model.tab, pageModel.model.pagination.page),
      }
    case 'ArticlePageModel':
      return { page: pageArticle(pageModel.model.slug) }
    case 'LoginPageModel':
      return { page: pageLogin() }
    case 'SignupPageModel':
      return { page: pageSignup() }
    case 'SettingsPageModel':
      return { page: pageSettings() }
    case 'ProfilePageModel':
      return {
        page: pageProfile(
          pageModel.model.username,
          pageModel.model.showFavorites,
        ),
      }
    case 'EditorPageModel':
      return { page: pageEditor(O.fromNullable(pageModel.model.slug)) }
    case 'NotFoundPageModel':
      return { page: pageNotFound() }
  }
}

// `pageModel` is the single source of truth for navigation: the route is
// derived from it (`pageModelToRoute`) and the URL from the route
// (`pushUrl` / `replaceUrl` in `common/util/url.ts`), never the other way round
export type Model = {
  pageModel: PageModel
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
  | { _tag: 'Navigate'; route: AppRoute }
  // Browser back / forward: the only URL change that comes from outside
  // after boot
  | { _tag: 'UrlChanged'; url: URL }
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
