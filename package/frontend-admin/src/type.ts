import type * as TeaRouter from '@rinn7e/tea-cup-router'
import { type Option } from 'fp-ts/lib/Option'

import { type AuthUser } from '@/common/type/auth-user'
import { type AppRoute } from '@/common/type/route'
import { type Shared } from '@/common/type/shared'
import type * as Persona from '@/component/persona-panel'
import type * as ArticlePage from '@/page/article-page'
import type * as CommentPage from '@/page/comment-page'
import type * as HomePage from '@/page/home-page'
import type * as LoginPage from '@/page/login-page'
import type * as UserPage from '@/page/user-page'
import type * as VisitorPage from '@/page/visitor-page'

import { type ColorScheme, type Theme } from './theme/type'

export type Model = {
  readonly router: TeaRouter.Model<AppRoute, PageModel>
  readonly shared: Shared
  readonly persona: Persona.Model
  readonly showScrollTop: boolean
  readonly theme: Theme
  readonly colorScheme: ColorScheme
}

export type PageModel =
  | { readonly _tag: 'HomePageModel'; readonly model: HomePage.Model }
  | { readonly _tag: 'LoginPageModel'; readonly model: LoginPage.Model }
  | { readonly _tag: 'ArticlePageModel'; readonly model: ArticlePage.Model }
  | { readonly _tag: 'UserPageModel'; readonly model: UserPage.Model }
  | { readonly _tag: 'CommentPageModel'; readonly model: CommentPage.Model }
  | { readonly _tag: 'VisitorPageModel'; readonly model: VisitorPage.Model }
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
  | { readonly _tag: 'HomePageMsg'; readonly subMsg: HomePage.Msg }
  | { readonly _tag: 'LoginPageMsg'; readonly subMsg: LoginPage.Msg }
  | { readonly _tag: 'ArticlePageMsg'; readonly subMsg: ArticlePage.Msg }
  | { readonly _tag: 'UserPageMsg'; readonly subMsg: UserPage.Msg }
  | { readonly _tag: 'CommentPageMsg'; readonly subMsg: CommentPage.Msg }
  | { readonly _tag: 'VisitorPageMsg'; readonly subMsg: VisitorPage.Msg }
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
