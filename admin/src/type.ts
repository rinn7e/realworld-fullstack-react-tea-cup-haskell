import { type Option } from 'fp-ts/lib/Option'

import { type AppRoute } from '@/common/type/route'
import type * as Persona from '@/component/persona-panel/type'
import type * as Articles from '@/page/articles'
import type * as Comments from '@/page/comments'
import type * as Home from '@/page/home'
import type * as Login from '@/page/login'
import type * as Users from '@/page/users'
import type * as Visitors from '@/page/visitors'

import { type Theme } from './theme/type'
import { type ColorScheme } from './theme/util'

export type User = {
  username: string
  email: string
  token: string
  bio: string | null
  image: string | null
}

export type Shared = {
  user: Option<User>
  token: Option<string>
}

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
  | { _tag: 'ArticlesPageModel'; model: Articles.Model }
  | { _tag: 'UsersPageModel'; model: Users.Model }
  | { _tag: 'CommentsPageModel'; model: Comments.Model }
  | { _tag: 'VisitorsPageModel'; model: Visitors.Model }
  | { _tag: 'SettingsPageModel' }
  | { _tag: 'NotFoundPageModel' }

export type Msg =
  | { _tag: 'UrlChange'; location: Location }
  | { _tag: 'ChangeRoute'; route: AppRoute }
  | {
      readonly _tag: 'Init'
      readonly location: Location
      readonly user: Option<User>
      readonly isUnavailable: boolean
      readonly token: Option<string>
    }
  | { _tag: 'Logout' }
  | { _tag: 'HomePageMsg'; subMsg: Home.Msg }
  | { _tag: 'LoginPageMsg'; subMsg: Login.Msg }
  | { _tag: 'ArticlesPageMsg'; subMsg: Articles.Msg }
  | { _tag: 'UsersPageMsg'; subMsg: Users.Msg }
  | { _tag: 'CommentsPageMsg'; subMsg: Comments.Msg }
  | { _tag: 'VisitorsPageMsg'; subMsg: Visitors.Msg }
  | { _tag: 'PersonaMsg'; subMsg: Persona.Msg }
  | { _tag: 'SetShowScrollTop'; value: boolean }
  | { _tag: 'ScrollToTop' }
  | { _tag: 'SwitchTheme'; theme: Theme }
  | { _tag: 'SetColorScheme'; scheme: ColorScheme }
  | { _tag: 'NoOp' }
