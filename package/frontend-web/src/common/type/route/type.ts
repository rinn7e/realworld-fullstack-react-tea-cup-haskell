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

export type PageHome = {
  readonly _tag: 'PageHome'
  tab: HomeTab
  page: number
}

export type PageLogin = {
  readonly _tag: 'PageLogin'
}

export type PageSignup = {
  readonly _tag: 'PageSignup'
}

export type PageSettings = {
  readonly _tag: 'PageSettings'
}

export type PageEditor = {
  readonly _tag: 'PageEditor'
  slug: Option<string>
}

export type PageArticle = {
  readonly _tag: 'PageArticle'
  slug: string
}

export type PageProfile = {
  readonly _tag: 'PageProfile'
  username: string
  favorites: boolean
}

export type PageNotFound = {
  readonly _tag: 'PageNotFound'
}

export type AppPage =
  | PageHome
  | PageLogin
  | PageSignup
  | PageSettings
  | PageEditor
  | PageArticle
  | PageProfile
  | PageNotFound

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

export const PageHomeEq: EqClass.Eq<PageHome> = EqClass.struct({
  _tag: S.Eq,
  tab: HomeTabEq,
  page: N.Eq,
})

export const PageLoginEq: EqClass.Eq<PageLogin> = EqClass.struct({
  _tag: S.Eq,
})

export const PageSignupEq: EqClass.Eq<PageSignup> = EqClass.struct({
  _tag: S.Eq,
})

export const PageSettingsEq: EqClass.Eq<PageSettings> = EqClass.struct({
  _tag: S.Eq,
})

export const PageEditorEq: EqClass.Eq<PageEditor> = EqClass.struct({
  _tag: S.Eq,
  slug: O.getEq(S.Eq),
})

export const PageArticleEq: EqClass.Eq<PageArticle> = EqClass.struct({
  _tag: S.Eq,
  slug: S.Eq,
})

export const PageProfileEq: EqClass.Eq<PageProfile> = EqClass.struct({
  _tag: S.Eq,
  username: S.Eq,
  favorites: B.Eq,
})

export const PageNotFoundEq: EqClass.Eq<PageNotFound> = EqClass.struct({
  _tag: S.Eq,
})

export const AppPageEq: EqClass.Eq<AppPage> = {
  equals: (x, y) => {
    if (x._tag === 'PageHome' && y._tag === 'PageHome') {
      return PageHomeEq.equals(x, y)
    } else if (x._tag === 'PageLogin' && y._tag === 'PageLogin') {
      return PageLoginEq.equals(x, y)
    } else if (x._tag === 'PageSignup' && y._tag === 'PageSignup') {
      return PageSignupEq.equals(x, y)
    } else if (x._tag === 'PageSettings' && y._tag === 'PageSettings') {
      return PageSettingsEq.equals(x, y)
    } else if (x._tag === 'PageEditor' && y._tag === 'PageEditor') {
      return PageEditorEq.equals(x, y)
    } else if (x._tag === 'PageArticle' && y._tag === 'PageArticle') {
      return PageArticleEq.equals(x, y)
    } else if (x._tag === 'PageProfile' && y._tag === 'PageProfile') {
      return PageProfileEq.equals(x, y)
    } else if (x._tag === 'PageNotFound' && y._tag === 'PageNotFound') {
      return PageNotFoundEq.equals(x, y)
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
  page: pageHome(),
})

export const globalFeedTab = (): HomeTab => ({ _tag: 'GlobalFeedTab' })
export const userFeedTab = (): HomeTab => ({ _tag: 'UserFeedTab' })
export const tagFeedTab = (tag: string): HomeTab => ({
  _tag: 'TagFeedTab',
  tag,
})

export const pageHome = (
  tab: HomeTab = globalFeedTab(),
  page: number = 1,
): AppPage => ({
  _tag: 'PageHome',
  tab,
  page,
})
export const pageLogin = (): AppPage => ({ _tag: 'PageLogin' })
export const pageSignup = (): AppPage => ({ _tag: 'PageSignup' })
export const pageSettings = (): AppPage => ({ _tag: 'PageSettings' })
export const pageEditor = (slug: Option<string>): AppPage => ({
  _tag: 'PageEditor',
  slug,
})
export const pageArticle = (slug: string): AppPage => ({
  _tag: 'PageArticle',
  slug,
})
export const pageProfile = (username: string, favorites: boolean): AppPage => ({
  _tag: 'PageProfile',
  username,
  favorites,
})
export const pageNotFound = (): AppPage => ({ _tag: 'PageNotFound' })
