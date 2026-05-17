import * as EqClass from 'fp-ts/lib/Eq'
import * as O from 'fp-ts/lib/Option'
import { type Option } from 'fp-ts/lib/Option'
import * as B from 'fp-ts/lib/boolean'
import * as N from 'fp-ts/lib/number'
import * as S from 'fp-ts/lib/string'

export type HomeTab =
  | { _tag: 'GlobalFeedTab' }
  | { _tag: 'UserFeedTab' }
  | { _tag: 'TagFeedTab'; tag: string }

export type HomePage = {
  readonly _tag: 'HomePage'
  tab: HomeTab
  page: number
}

export type LoginPage = {
  readonly _tag: 'LoginPage'
}

export type SignupPage = {
  readonly _tag: 'SignupPage'
}

export type SettingsPage = {
  readonly _tag: 'SettingsPage'
}

export type EditorPage = {
  readonly _tag: 'EditorPage'
  slug: Option<string>
}

export type ArticlePage = {
  readonly _tag: 'ArticlePage'
  slug: string
}

export type ProfilePage = {
  readonly _tag: 'ProfilePage'
  username: string
  favorites: boolean
}

export type NotFoundPage = {
  readonly _tag: 'NotFoundPage'
}

export type AppPage =
  | HomePage
  | LoginPage
  | SignupPage
  | SettingsPage
  | EditorPage
  | ArticlePage
  | ProfilePage
  | NotFoundPage

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

export const HomePageEq: EqClass.Eq<HomePage> = EqClass.struct({
  _tag: S.Eq,
  tab: HomeTabEq,
  page: N.Eq,
})

export const LoginPageEq: EqClass.Eq<LoginPage> = EqClass.struct({
  _tag: S.Eq,
})

export const SignupPageEq: EqClass.Eq<SignupPage> = EqClass.struct({
  _tag: S.Eq,
})

export const SettingsPageEq: EqClass.Eq<SettingsPage> = EqClass.struct({
  _tag: S.Eq,
})

export const EditorPageEq: EqClass.Eq<EditorPage> = EqClass.struct({
  _tag: S.Eq,
  slug: O.getEq(S.Eq),
})

export const ArticlePageEq: EqClass.Eq<ArticlePage> = EqClass.struct({
  _tag: S.Eq,
  slug: S.Eq,
})

export const ProfilePageEq: EqClass.Eq<ProfilePage> = EqClass.struct({
  _tag: S.Eq,
  username: S.Eq,
  favorites: B.Eq,
})

export const NotFoundPageEq: EqClass.Eq<NotFoundPage> = EqClass.struct({
  _tag: S.Eq,
})

export const AppPageEq: EqClass.Eq<AppPage> = {
  equals: (x, y) => {
    if (x._tag === 'HomePage' && y._tag === 'HomePage') {
      return HomePageEq.equals(x, y)
    } else if (x._tag === 'LoginPage' && y._tag === 'LoginPage') {
      return LoginPageEq.equals(x, y)
    } else if (x._tag === 'SignupPage' && y._tag === 'SignupPage') {
      return SignupPageEq.equals(x, y)
    } else if (x._tag === 'SettingsPage' && y._tag === 'SettingsPage') {
      return SettingsPageEq.equals(x, y)
    } else if (x._tag === 'EditorPage' && y._tag === 'EditorPage') {
      return EditorPageEq.equals(x, y)
    } else if (x._tag === 'ArticlePage' && y._tag === 'ArticlePage') {
      return ArticlePageEq.equals(x, y)
    } else if (x._tag === 'ProfilePage' && y._tag === 'ProfilePage') {
      return ProfilePageEq.equals(x, y)
    } else if (x._tag === 'NotFoundPage' && y._tag === 'NotFoundPage') {
      return NotFoundPageEq.equals(x, y)
    } else {
      return false
    }
  },
}

export const AppRouteEq: EqClass.Eq<AppRoute> = EqClass.struct({
  page: AppPageEq,
})

export type AppRoute = {
  page: AppPage
}

export const defaultAppRoute = (): AppRoute => ({
  page: homePage(),
})

export const globalFeedTab = (): HomeTab => ({ _tag: 'GlobalFeedTab' })
export const userFeedTab = (): HomeTab => ({ _tag: 'UserFeedTab' })
export const tagFeedTab = (tag: string): HomeTab => ({
  _tag: 'TagFeedTab',
  tag,
})

export const homePage = (
  tab: HomeTab = globalFeedTab(),
  page: number = 1,
): AppPage => ({
  _tag: 'HomePage',
  tab,
  page,
})
export const loginPage = (): AppPage => ({ _tag: 'LoginPage' })
export const signupPage = (): AppPage => ({ _tag: 'SignupPage' })
export const settingsPage = (): AppPage => ({ _tag: 'SettingsPage' })
export const editorPage = (slug: Option<string>): AppPage => ({
  _tag: 'EditorPage',
  slug,
})
export const articlePage = (slug: string): AppPage => ({
  _tag: 'ArticlePage',
  slug,
})
export const profilePage = (username: string, favorites: boolean): AppPage => ({
  _tag: 'ProfilePage',
  username,
  favorites,
})
export const notFoundPage = (): AppPage => ({ _tag: 'NotFoundPage' })
