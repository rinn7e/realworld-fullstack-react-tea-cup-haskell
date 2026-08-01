import { type Option } from 'fp-ts/lib/Option'

import { type AuthUser } from '@/common/type/auth-user'
import { type AppRoute } from '@/common/type/route'
import { type Shared } from '@/common/type/shared'
import type * as Persona from '@/component/persona-panel/type'
import type * as Articles from '@/page/article'
import type * as Comments from '@/page/comment'
import type * as Home from '@/page/home'
import type * as Login from '@/page/login'
import type * as Users from '@/page/user'
import type * as Visitors from '@/page/visitor'

import { type Theme } from './theme/type'
import { type ColorScheme } from './theme/util'

export type Model = {
  route: AppRoute
  shared: Shared
  pageModel: PageModel
  persona: Persona.Model
  showScrollTop: boolean
  theme: Theme
  colorScheme: ColorScheme
  isInternal: boolean
}

export type PageModel =
  | { _tag: 'HomePageModel'; model: Home.Model }
  | { _tag: 'LoginPageModel'; model: Login.Model }
  | { _tag: 'ArticlePageModel'; model: Articles.Model }
  | { _tag: 'UserPageModel'; model: Users.Model }
  | { _tag: 'CommentPageModel'; model: Comments.Model }
  | { _tag: 'VisitorPageModel'; model: Visitors.Model }
  | { _tag: 'SettingPageModel' }
  | { _tag: 'NotFoundPageModel' }

export type Msg =
  | { _tag: 'UrlChange'; location: Location }
  | { _tag: 'ChangeRoute'; route: AppRoute }
  | {
      readonly _tag: 'Init'
      readonly location: Location
      readonly user: Option<AuthUser>
      readonly isUnavailable: boolean
      readonly token: Option<string>
    }
  | { _tag: 'Logout' }
  | { _tag: 'HomePageMsg'; subMsg: Home.Msg }
  | { _tag: 'LoginPageMsg'; subMsg: Login.Msg }
  | { _tag: 'ArticlePageMsg'; subMsg: Articles.Msg }
  | { _tag: 'UserPageMsg'; subMsg: Users.Msg }
  | { _tag: 'CommentPageMsg'; subMsg: Comments.Msg }
  | { _tag: 'VisitorPageMsg'; subMsg: Visitors.Msg }
  | { _tag: 'PersonaMsg'; subMsg: Persona.Msg }
  | { _tag: 'SetShowScrollTop'; value: boolean }
  | { _tag: 'ScrollToTop' }
  | { _tag: 'SwitchTheme'; theme: Theme }
  | { _tag: 'SetColorScheme'; scheme: ColorScheme }
  | { _tag: 'NoOp' }
