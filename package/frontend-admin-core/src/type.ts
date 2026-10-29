import { type Option } from 'fp-ts/lib/Option'

import { type AuthUser } from '@core/common/type/auth-user'
import { type Brand } from '@core/common/type/brand-wrapper'
import {
  type DestinationAfterGuard,
  type NavigationMsg,
  type Screen,
} from '@core/common/type/destination'
import { type Shared } from '@core/common/type/shared'
import type * as ArticleScreen from '@core/screen/article-screen'
import type * as CommentScreen from '@core/screen/comment-screen'
import type * as HomeScreen from '@core/screen/home-screen'
import type * as LoginScreen from '@core/screen/login-screen'
import type * as UserScreen from '@core/screen/user-screen'
import type * as VisitorScreen from '@core/screen/visitor-screen'

// The part of the app model every app shares: the screen shown and the
// session. An app adds its own fields beside them (the web its theme and
// persona panel); the core's handlers keep those fields as they are.
export type Model = {
  readonly screenModel: CurrentScreenModel
  readonly shared: Shared
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

// The screen shown (`Model.screenModel`). Owned: read it anywhere as a
// `ScreenModel`, but only the two functions below make one (the brand has
// no value). So the screen changes only by a move; its own messages change
// its model in place. Review: a cast to it outside this file changes the
// screen without a move.
declare class _CurrentScreenModelBrand {
  private _currentScreenModelBrand(): void
}

export type CurrentScreenModel = Brand<ScreenModel, _CurrentScreenModelBrand>

// The screen model a move opens: the destination the guard let through
// (`initScreenModel`). Review: called by the navigation
// (`navigation-handler.ts`) and tests only (lint); anywhere else it changes
// the screen without the move.
export const currentScreenModelOfMove =
  (_destination: DestinationAfterGuard) =>
  (screenModel: ScreenModel): CurrentScreenModel =>
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    screenModel as CurrentScreenModel

// The screen shown with its model changed in place by its own messages.
// Another screen keeps the one shown: that is a move. Review: for the
// model of the screen shown; to open another screen, navigate.
export const sameScreenWith =
  (current: CurrentScreenModel) =>
  (screenModel: ScreenModel): CurrentScreenModel =>
    screenModel._tag === current._tag
      ? // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        (screenModel as CurrentScreenModel)
      : current

// What the boot learnt from the server about the stored token
// (`initializeCmd`)
export type Boot = {
  readonly user: Option<AuthUser>
  readonly isUnavailable: boolean
  readonly token: Option<string>
}

// The messages every app shares. An app adds its own beside them and hands
// these to the core's `update`.
export type Msg =
  | { readonly _tag: 'NavigationMsg'; readonly subMsg: NavigationMsg }
  | { readonly _tag: 'Logout' }
  | { readonly _tag: 'HomeScreenMsg'; readonly subMsg: HomeScreen.Msg }
  | { readonly _tag: 'LoginScreenMsg'; readonly subMsg: LoginScreen.Msg }
  | { readonly _tag: 'ArticleScreenMsg'; readonly subMsg: ArticleScreen.Msg }
  | { readonly _tag: 'UserScreenMsg'; readonly subMsg: UserScreen.Msg }
  | { readonly _tag: 'CommentScreenMsg'; readonly subMsg: CommentScreen.Msg }
  | { readonly _tag: 'VisitorScreenMsg'; readonly subMsg: VisitorScreen.Msg }
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
// tag, which narrows the `Model` built from it). Keeps the app's own fields.
export const withScreenModel = <M extends Model>(
  model: M,
  screenModel: CurrentScreenModel,
): M => ({ ...model, screenModel })
