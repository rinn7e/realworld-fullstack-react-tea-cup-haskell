import { type Option } from 'fp-ts/lib/Option'

import { type AuthUser } from '@/common/type/auth-user'
import { type NavigationMsg, type Screen } from '@/common/type/destination'
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
  readonly screenModel: ScreenModel
  readonly shared: Shared
  readonly persona: Persona.Model
  readonly showScrollTop: boolean
  readonly theme: Theme
  readonly colorScheme: ColorScheme
}

// The screen shown, as its model. Its tag is the destination's screen
// (`currentScreenOf`): a `currentScreen` field next to it would say the
// same thing twice.
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
  | { readonly _tag: 'NavigationMsg'; readonly subMsg: NavigationMsg }
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

// The screen shown (the destination's `screen`, `destinationOf`)
export const currentScreenOf = (screenModel: ScreenModel): Screen => {
  switch (screenModel._tag) {
    case 'HomeScreenModel':
      return { _tag: 'HomeScreen' }
    case 'LoginScreenModel':
      return { _tag: 'LoginScreen' }
    case 'ArticleScreenModel':
      return { _tag: 'ArticleScreen' }
    case 'UserScreenModel':
      return { _tag: 'UserScreen' }
    case 'CommentScreenModel':
      return { _tag: 'CommentScreen' }
    case 'VisitorScreenModel':
      return { _tag: 'VisitorScreen' }
    case 'SettingScreenModel':
      return { _tag: 'SettingScreen' }
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
