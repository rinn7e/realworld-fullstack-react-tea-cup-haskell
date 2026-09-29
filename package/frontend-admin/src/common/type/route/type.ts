import * as EqClass from 'fp-ts/lib/Eq'
import * as S from 'fp-ts/lib/string'

export type PageHome = { _tag: 'PageHome' }
export type PageLogin = { _tag: 'PageLogin' }
export type PageArticle = { _tag: 'PageArticle' }
export type PageUser = { _tag: 'PageUser' }
export type PageComment = { _tag: 'PageComment' }
export type PageVisitor = { _tag: 'PageVisitor' }
export type PageSetting = { _tag: 'PageSetting' }
export type PageNotFound = { _tag: 'PageNotFound' }

export type AppPage =
  | PageHome
  | PageLogin
  | PageArticle
  | PageUser
  | PageComment
  | PageVisitor
  | PageSetting
  | PageNotFound

export const PageHomeEq: EqClass.Eq<PageHome> = EqClass.struct({
  _tag: S.Eq,
})

export const PageLoginEq: EqClass.Eq<PageLogin> = EqClass.struct({
  _tag: S.Eq,
})

export const PageArticleEq: EqClass.Eq<PageArticle> = EqClass.struct({
  _tag: S.Eq,
})

export const PageUserEq: EqClass.Eq<PageUser> = EqClass.struct({
  _tag: S.Eq,
})

export const PageCommentEq: EqClass.Eq<PageComment> = EqClass.struct({
  _tag: S.Eq,
})

export const PageVisitorEq: EqClass.Eq<PageVisitor> = EqClass.struct({
  _tag: S.Eq,
})

export const PageSettingEq: EqClass.Eq<PageSetting> = EqClass.struct({
  _tag: S.Eq,
})

export const PageNotFoundEq: EqClass.Eq<PageNotFound> = EqClass.struct({
  _tag: S.Eq,
})

export const AppPageEq: EqClass.Eq<AppPage> = {
  equals: (a, b) => {
    switch (a._tag) {
      case 'PageHome':
        return b._tag === 'PageHome' && PageHomeEq.equals(a, b)
      case 'PageLogin':
        return b._tag === 'PageLogin' && PageLoginEq.equals(a, b)
      case 'PageArticle':
        return b._tag === 'PageArticle' && PageArticleEq.equals(a, b)
      case 'PageUser':
        return b._tag === 'PageUser' && PageUserEq.equals(a, b)
      case 'PageComment':
        return b._tag === 'PageComment' && PageCommentEq.equals(a, b)
      case 'PageVisitor':
        return b._tag === 'PageVisitor' && PageVisitorEq.equals(a, b)
      case 'PageSetting':
        return b._tag === 'PageSetting' && PageSettingEq.equals(a, b)
      case 'PageNotFound':
        return b._tag === 'PageNotFound' && PageNotFoundEq.equals(a, b)
    }
  },
}

export type AppRoute = {
  page: AppPage
}

export const AppRouteEq: EqClass.Eq<AppRoute> = EqClass.struct({
  page: AppPageEq,
})

export const pageHome = (): AppPage => ({ _tag: 'PageHome' })
export const pageLogin = (): AppPage => ({ _tag: 'PageLogin' })
export const pageArticles = (): AppPage => ({ _tag: 'PageArticle' })
export const pageUsers = (): AppPage => ({ _tag: 'PageUser' })
export const pageComments = (): AppPage => ({ _tag: 'PageComment' })
export const pageVisitors = (): AppPage => ({ _tag: 'PageVisitor' })
export const pageSettings = (): AppPage => ({ _tag: 'PageSetting' })
export const pageNotFound = (): AppPage => ({ _tag: 'PageNotFound' })
