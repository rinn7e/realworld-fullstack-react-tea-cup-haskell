import * as EqClass from 'fp-ts/lib/Eq'
import * as S from 'fp-ts/lib/string'

export type HomePage = { _tag: 'HomePage' }
export type LoginPage = { _tag: 'LoginPage' }
export type ArticlesPage = { _tag: 'ArticlesPage' }
export type UsersPage = { _tag: 'UsersPage' }
export type CommentsPage = { _tag: 'CommentsPage' }
export type VisitorsPage = { _tag: 'VisitorsPage' }
export type SettingsPage = { _tag: 'SettingsPage' }
export type NotFoundPage = { _tag: 'NotFoundPage' }

export type AppPage =
  | HomePage
  | LoginPage
  | ArticlesPage
  | UsersPage
  | CommentsPage
  | VisitorsPage
  | SettingsPage
  | NotFoundPage

export const HomePageEq: EqClass.Eq<HomePage> = EqClass.struct({
  _tag: S.Eq,
})

export const LoginPageEq: EqClass.Eq<LoginPage> = EqClass.struct({
  _tag: S.Eq,
})

export const ArticlesPageEq: EqClass.Eq<ArticlesPage> = EqClass.struct({
  _tag: S.Eq,
})

export const UsersPageEq: EqClass.Eq<UsersPage> = EqClass.struct({
  _tag: S.Eq,
})

export const CommentsPageEq: EqClass.Eq<CommentsPage> = EqClass.struct({
  _tag: S.Eq,
})

export const VisitorsPageEq: EqClass.Eq<VisitorsPage> = EqClass.struct({
  _tag: S.Eq,
})

export const SettingsPageEq: EqClass.Eq<SettingsPage> = EqClass.struct({
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
      case 'ArticlesPage':
        return ArticlesPageEq.equals(a, b as ArticlesPage)
      case 'UsersPage':
        return UsersPageEq.equals(a, b as UsersPage)
      case 'CommentsPage':
        return CommentsPageEq.equals(a, b as CommentsPage)
      case 'VisitorsPage':
        return VisitorsPageEq.equals(a, b as VisitorsPage)
      case 'SettingsPage':
        return SettingsPageEq.equals(a, b as SettingsPage)
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
export const articlesPage = (): AppPage => ({ _tag: 'ArticlesPage' })
export const usersPage = (): AppPage => ({ _tag: 'UsersPage' })
export const commentsPage = (): AppPage => ({ _tag: 'CommentsPage' })
export const visitorsPage = (): AppPage => ({ _tag: 'VisitorsPage' })
export const settingsPage = (): AppPage => ({ _tag: 'SettingsPage' })
export const notFoundPage = (): AppPage => ({ _tag: 'NotFoundPage' })
