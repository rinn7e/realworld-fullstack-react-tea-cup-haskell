import type * as TeaRouter from '@rinn7e/tea-cup-router'
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
  readonly router: TeaRouter.Model<AppRoute, PageModel>
  readonly shared: Shared
  readonly persona: Persona.Model
  readonly showScrollTop: boolean
  readonly theme: Theme
  readonly colorScheme: ColorScheme
}

export type PageModel =
  | { readonly _tag: 'HomePageModel'; readonly model: Home.Model }
  | { readonly _tag: 'LoginPageModel'; readonly model: Login.Model }
  | { readonly _tag: 'ArticlePageModel'; readonly model: Articles.Model }
  | { readonly _tag: 'UserPageModel'; readonly model: Users.Model }
  | { readonly _tag: 'CommentPageModel'; readonly model: Comments.Model }
  | { readonly _tag: 'VisitorPageModel'; readonly model: Visitors.Model }
  | { readonly _tag: 'SettingPageModel' }
  | { readonly _tag: 'NotFoundPageModel' }

export type Msg =
  | {
      readonly _tag: 'TeaRouterMsg'
      readonly subMsg: TeaRouter.Msg<AppRoute>
    }
  | {
      readonly _tag: 'Init'
      readonly location: Location
      readonly user: Option<AuthUser>
      readonly isUnavailable: boolean
      readonly token: Option<string>
    }
  | { readonly _tag: 'Logout' }
  | { readonly _tag: 'HomePageMsg'; readonly subMsg: Home.Msg }
  | { readonly _tag: 'LoginPageMsg'; readonly subMsg: Login.Msg }
  | { readonly _tag: 'ArticlePageMsg'; readonly subMsg: Articles.Msg }
  | { readonly _tag: 'UserPageMsg'; readonly subMsg: Users.Msg }
  | { readonly _tag: 'CommentPageMsg'; readonly subMsg: Comments.Msg }
  | { readonly _tag: 'VisitorPageMsg'; readonly subMsg: Visitors.Msg }
  | { readonly _tag: 'PersonaMsg'; readonly subMsg: Persona.Msg }
  | { readonly _tag: 'SetShowScrollTop'; readonly value: boolean }
  | { readonly _tag: 'ScrollToTop' }
  | { readonly _tag: 'SwitchTheme'; readonly theme: Theme }
  | { readonly _tag: 'SetColorScheme'; readonly scheme: ColorScheme }
  | { readonly _tag: 'NoOp' }

export const teaRouterMsg = (subMsg: TeaRouter.Msg<AppRoute>): Msg => ({
  _tag: 'TeaRouterMsg',
  subMsg,
})
