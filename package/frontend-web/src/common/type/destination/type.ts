import * as EqClass from 'fp-ts/lib/Eq'
import * as O from 'fp-ts/lib/Option'
import { type Option } from 'fp-ts/lib/Option'
import * as B from 'fp-ts/lib/boolean'
import * as N from 'fp-ts/lib/number'
import * as S from 'fp-ts/lib/string'

import { type Brand } from '@/common/type/brand-wrapper'

export type HomeTab =
  | { _tag: 'GlobalFeedTab' }
  | { _tag: 'UserFeedTab' }
  | { _tag: 'TagFeedTab'; tag: string }

export type HomeScreen = {
  readonly _tag: 'HomeScreen'
  tab: HomeTab
  page: number
}

export type LoginScreen = {
  readonly _tag: 'LoginScreen'
}

export type SignupScreen = {
  readonly _tag: 'SignupScreen'
}

export type SettingsScreen = {
  readonly _tag: 'SettingsScreen'
}

export type EditorScreen = {
  readonly _tag: 'EditorScreen'
  slug: Option<string>
}

export type ArticleScreen = {
  readonly _tag: 'ArticleScreen'
  slug: string
}

export type ProfileScreen = {
  readonly _tag: 'ProfileScreen'
  username: string
  favorites: boolean
}

export type NotFoundScreen = {
  readonly _tag: 'NotFoundScreen'
}

export type Screen =
  | HomeScreen
  | LoginScreen
  | SignupScreen
  | SettingsScreen
  | EditorScreen
  | ArticleScreen
  | ProfileScreen
  | NotFoundScreen

export const HomeTabEq: EqClass.Eq<HomeTab> = {
  equals: (x, y) => {
    if (x._tag === 'GlobalFeedTab' && y._tag === 'GlobalFeedTab') {
      return EqClass.struct({
        _tag: S.Eq,
      }).equals(x, y)
    } else if (x._tag === 'UserFeedTab' && y._tag === 'UserFeedTab') {
      return EqClass.struct({
        _tag: S.Eq,
      }).equals(x, y)
    } else if (x._tag === 'TagFeedTab' && y._tag === 'TagFeedTab') {
      return EqClass.struct({
        _tag: S.Eq,
        tag: S.Eq,
      }).equals(x, y)
    } else {
      return false
    }
  },
}

export const HomeScreenEq: EqClass.Eq<HomeScreen> = EqClass.struct({
  _tag: S.Eq,
  tab: HomeTabEq,
  page: N.Eq,
})

export const LoginScreenEq: EqClass.Eq<LoginScreen> = EqClass.struct({
  _tag: S.Eq,
})

export const SignupScreenEq: EqClass.Eq<SignupScreen> = EqClass.struct({
  _tag: S.Eq,
})

export const SettingsScreenEq: EqClass.Eq<SettingsScreen> = EqClass.struct({
  _tag: S.Eq,
})

export const EditorScreenEq: EqClass.Eq<EditorScreen> = EqClass.struct({
  _tag: S.Eq,
  slug: O.getEq(S.Eq),
})

export const ArticleScreenEq: EqClass.Eq<ArticleScreen> = EqClass.struct({
  _tag: S.Eq,
  slug: S.Eq,
})

export const ProfileScreenEq: EqClass.Eq<ProfileScreen> = EqClass.struct({
  _tag: S.Eq,
  username: S.Eq,
  favorites: B.Eq,
})

export const NotFoundScreenEq: EqClass.Eq<NotFoundScreen> = EqClass.struct({
  _tag: S.Eq,
})

export const ScreenEq: EqClass.Eq<Screen> = {
  equals: (x, y) => {
    if (x._tag === 'HomeScreen' && y._tag === 'HomeScreen') {
      return HomeScreenEq.equals(x, y)
    } else if (x._tag === 'LoginScreen' && y._tag === 'LoginScreen') {
      return LoginScreenEq.equals(x, y)
    } else if (x._tag === 'SignupScreen' && y._tag === 'SignupScreen') {
      return SignupScreenEq.equals(x, y)
    } else if (x._tag === 'SettingsScreen' && y._tag === 'SettingsScreen') {
      return SettingsScreenEq.equals(x, y)
    } else if (x._tag === 'EditorScreen' && y._tag === 'EditorScreen') {
      return EditorScreenEq.equals(x, y)
    } else if (x._tag === 'ArticleScreen' && y._tag === 'ArticleScreen') {
      return ArticleScreenEq.equals(x, y)
    } else if (x._tag === 'ProfileScreen' && y._tag === 'ProfileScreen') {
      return ProfileScreenEq.equals(x, y)
    } else if (x._tag === 'NotFoundScreen' && y._tag === 'NotFoundScreen') {
      return NotFoundScreenEq.equals(x, y)
    } else {
      return false
    }
  },
}

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

export const destinationOfScreen = (screen: Screen): Destination => ({
  screen,
})

export const defaultDestination = (): Destination =>
  destinationOfScreen(homeScreen())

export const loginDestination = (): Destination =>
  destinationOfScreen(loginScreen())

export const globalFeedTab = (): HomeTab => ({ _tag: 'GlobalFeedTab' })
export const userFeedTab = (): HomeTab => ({ _tag: 'UserFeedTab' })
export const tagFeedTab = (tag: string): HomeTab => ({
  _tag: 'TagFeedTab',
  tag,
})

export const homeScreen = (
  tab: HomeTab = globalFeedTab(),
  page: number = 1,
): Screen => ({
  _tag: 'HomeScreen',
  tab,
  page,
})
export const loginScreen = (): Screen => ({ _tag: 'LoginScreen' })
export const signupScreen = (): Screen => ({ _tag: 'SignupScreen' })
export const settingsScreen = (): Screen => ({ _tag: 'SettingsScreen' })
export const editorScreen = (slug: Option<string>): Screen => ({
  _tag: 'EditorScreen',
  slug,
})
export const articleScreen = (slug: string): Screen => ({
  _tag: 'ArticleScreen',
  slug,
})
export const profileScreen = (
  username: string,
  favorites: boolean,
): Screen => ({
  _tag: 'ProfileScreen',
  username,
  favorites,
})
export const notFoundScreen = (): Screen => ({ _tag: 'NotFoundScreen' })

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
