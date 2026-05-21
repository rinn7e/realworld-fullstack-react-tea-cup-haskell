import * as EqClass from 'fp-ts/lib/Eq'
import * as S from 'fp-ts/lib/string'

export type HomePage = { _tag: 'HomePage' }
export type LoginPage = { _tag: 'LoginPage' }
export type ArticlePage = { _tag: 'ArticlePage' }
export type UserPage = { _tag: 'UserPage' }
export type CommentPage = { _tag: 'CommentPage' }
export type VisitorPage = { _tag: 'VisitorPage' }
export type SettingPage = { _tag: 'SettingPage' }
export type NotFoundPage = { _tag: 'NotFoundPage' }

export type AppPage =
  | HomePage
  | LoginPage
  | ArticlePage
  | UserPage
  | CommentPage
  | VisitorPage
  | SettingPage
  | NotFoundPage

export const HomePageEq: EqClass.Eq<HomePage> = EqClass.struct({
  _tag: S.Eq,
})

export const LoginPageEq: EqClass.Eq<LoginPage> = EqClass.struct({
  _tag: S.Eq,
})

export const ArticlePageEq: EqClass.Eq<ArticlePage> = EqClass.struct({
  _tag: S.Eq,
})

export const UserPageEq: EqClass.Eq<UserPage> = EqClass.struct({
  _tag: S.Eq,
})

export const CommentPageEq: EqClass.Eq<CommentPage> = EqClass.struct({
  _tag: S.Eq,
})

export const VisitorPageEq: EqClass.Eq<VisitorPage> = EqClass.struct({
  _tag: S.Eq,
})

export const SettingPageEq: EqClass.Eq<SettingPage> = EqClass.struct({
  _tag: S.Eq,
})

export const NotFoundPageEq: EqClass.Eq<NotFoundPage> = EqClass.struct({
  _tag: S.Eq,
})

export const AppPageEq: EqClass.Eq<AppPage> = {
  equals: (a, b) => {
    if (a._tag !== b._tag) return false
    switch (a._tag) {
      case 'HomePage':
        return HomePageEq.equals(a, b as HomePage)
      case 'LoginPage':
        return LoginPageEq.equals(a, b as LoginPage)
      case 'ArticlePage':
        return ArticlePageEq.equals(a, b as ArticlePage)
      case 'UserPage':
        return UserPageEq.equals(a, b as UserPage)
      case 'CommentPage':
        return CommentPageEq.equals(a, b as CommentPage)
      case 'VisitorPage':
        return VisitorPageEq.equals(a, b as VisitorPage)
      case 'SettingPage':
        return SettingPageEq.equals(a, b as SettingPage)
      case 'NotFoundPage':
        return NotFoundPageEq.equals(a, b as NotFoundPage)
    }
  },
}

export type AppRoute = {
  page: AppPage
}

export const AppRouteEq: EqClass.Eq<AppRoute> = EqClass.struct({
  page: AppPageEq,
})

export const homePage = (): AppPage => ({ _tag: 'HomePage' })
export const loginPage = (): AppPage => ({ _tag: 'LoginPage' })
export const articlesPage = (): AppPage => ({ _tag: 'ArticlePage' })
export const usersPage = (): AppPage => ({ _tag: 'UserPage' })
export const commentsPage = (): AppPage => ({ _tag: 'CommentPage' })
export const visitorsPage = (): AppPage => ({ _tag: 'VisitorPage' })
export const settingsPage = (): AppPage => ({ _tag: 'SettingPage' })
export const notFoundPage = (): AppPage => ({ _tag: 'NotFoundPage' })
