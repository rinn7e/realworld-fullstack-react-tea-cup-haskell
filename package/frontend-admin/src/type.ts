import type * as TeaRouter from '@rinn7e/tea-cup-router'
import { type Option } from 'fp-ts/lib/Option'

import { type AuthUser } from '@/common/type/auth-user'
import { type AppRoute } from '@/common/type/route'
import { type Shared } from '@/common/type/shared'
import type * as Persona from '@/component/persona-panel'
import type * as ArticleScreen from '@/screen/article-screen'
import type * as CommentScreen from '@/screen/comment-screen'
import type * as HomeScreen from '@/screen/home-screen'
import type * as LoginScreen from '@/screen/login-screen'
import type * as UserScreen from '@/screen/user-screen'
import type * as VisitorScreen from '@/screen/visitor-screen'

import { type ColorScheme, type Theme } from './theme/type'

export type Model = {
  readonly router: TeaRouter.Model<AppRoute, ScreenModel>
  readonly shared: Shared
  readonly persona: Persona.Model
  readonly showScrollTop: boolean
  readonly theme: Theme
  readonly colorScheme: ColorScheme
}

export type ScreenModel =
  | { readonly _tag: 'HomeScreenModel'; readonly model: HomeScreen.Model }
  | { readonly _tag: 'LoginScreenModel'; readonly model: LoginScreen.Model }
  | { readonly _tag: 'ArticleScreenModel'; readonly model: ArticleScreen.Model }
  | { readonly _tag: 'UserScreenModel'; readonly model: UserScreen.Model }
  | { readonly _tag: 'CommentScreenModel'; readonly model: CommentScreen.Model }
  | { readonly _tag: 'VisitorScreenModel'; readonly model: VisitorScreen.Model }
  | { readonly _tag: 'SettingScreenModel' }
  | { readonly _tag: 'NotFoundScreenModel' }

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
  | { readonly _tag: 'HomeScreenMsg'; readonly subMsg: HomeScreen.Msg }
  | { readonly _tag: 'LoginScreenMsg'; readonly subMsg: LoginScreen.Msg }
  | { readonly _tag: 'ArticleScreenMsg'; readonly subMsg: ArticleScreen.Msg }
  | { readonly _tag: 'UserScreenMsg'; readonly subMsg: UserScreen.Msg }
  | { readonly _tag: 'CommentScreenMsg'; readonly subMsg: CommentScreen.Msg }
  | { readonly _tag: 'VisitorScreenMsg'; readonly subMsg: VisitorScreen.Msg }
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
