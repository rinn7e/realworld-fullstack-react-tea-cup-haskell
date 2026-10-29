import * as EqClass from 'fp-ts/lib/Eq'
import * as S from 'fp-ts/lib/string'

import { type Brand } from '@core/common/type/brand-wrapper'

// The screen a destination shows. None of the admin screens has a param.
export type Screen =
  | { readonly _tag: 'HomeScreen' }
  | { readonly _tag: 'LoginScreen' }
  | { readonly _tag: 'ArticleScreen' }
  | { readonly _tag: 'UserScreen' }
  | { readonly _tag: 'CommentScreen' }
  | { readonly _tag: 'VisitorScreen' }
  | { readonly _tag: 'SettingScreen' }
  | { readonly _tag: 'NotFoundScreen' }

// No screen has a param, so the tag is the whole screen
export const ScreenEq: EqClass.Eq<Screen> = EqClass.struct({ _tag: S.Eq })

// Where the app is. Never stored: read from the models that show it
// (`destinationOf`), and written to the URL from there.
export type Destination = {
  readonly screen: Screen
}

// A destination the guard let through (`guardDestination`): the only kind a
// move opens. Owned: nothing else can make one (the brand has no value), so
// skipping the guard does not type check. Only a move holds one:
// `guardDestination` is called by the navigation, the boot and tests only
// (lint). Review: a cast to it outside `util/guard.ts` skips the guard.
declare class _DestinationAfterGuardBrand {
  private _destinationAfterGuardBrand(): void
}

export type DestinationAfterGuard = Brand<
  Destination,
  _DestinationAfterGuardBrand
>

export const DestinationEq: EqClass.Eq<Destination> = EqClass.struct({
  screen: ScreenEq,
})

export const homeScreen = (): Screen => ({ _tag: 'HomeScreen' })
export const loginScreen = (): Screen => ({ _tag: 'LoginScreen' })
export const articleScreen = (): Screen => ({ _tag: 'ArticleScreen' })
export const userScreen = (): Screen => ({ _tag: 'UserScreen' })
export const commentScreen = (): Screen => ({ _tag: 'CommentScreen' })
export const visitorScreen = (): Screen => ({ _tag: 'VisitorScreen' })
export const settingScreen = (): Screen => ({ _tag: 'SettingScreen' })
export const notFoundScreen = (): Screen => ({ _tag: 'NotFoundScreen' })

export const destinationOfScreen = (screen: Screen): Destination => ({
  screen,
})

export const defaultDestination = (): Destination =>
  destinationOfScreen(homeScreen())

export const loginDestination = (): Destination =>
  destinationOfScreen(loginScreen())

// Every move of the app goes through `navigationMsgHandler`. `UrlChanged`
// is the browser's back or forward, the only move that comes from the URL
// after the boot.
export type NavigationMsg =
  | {
      readonly _tag: 'Navigate'
      readonly destination: Destination
      readonly forceRefresh?: boolean
    }
  | {
      readonly _tag: 'ModifyDestination'
      readonly func: (destination: Destination) => Destination
      readonly forceRefresh?: boolean
    }
  | { readonly _tag: 'Refresh' }
  | { readonly _tag: 'UrlChanged'; readonly destination: Destination }
