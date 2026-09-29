import { Route, end, format, lit, parse, zero } from '@rinn7e/fp-ts-routing'

import { BASE_URL } from '@/common/env'

import {
  type AppPage,
  type AppRoute,
  pageArticles,
  pageComments,
  pageHome,
  pageLogin,
  pageNotFound,
  pageSettings,
  pageUsers,
  pageVisitors,
} from './type'

const homeMatch = end
const loginMatch = lit('login').and(end)
const articlesMatch = lit('articles').and(end)
const usersMatch = lit('users').and(end)
const commentsMatch = lit('comments').and(end)
const settingsMatch = lit('settings').and(end)
const visitorsMatch = lit('visitors').and(end)

const appRouter = zero<AppPage>()
  .alt(homeMatch.parser.map(pageHome))
  .alt(loginMatch.parser.map(pageLogin))
  .alt(articlesMatch.parser.map(pageArticles))
  .alt(usersMatch.parser.map(pageUsers))
  .alt(commentsMatch.parser.map(pageComments))
  .alt(visitorsMatch.parser.map(pageVisitors))
  .alt(settingsMatch.parser.map(pageSettings))

export const removeBaseUrl = (href: string): string => {
  const url = new URL(href)
  const base = BASE_URL.replace(/\/$/, '')
  const pathname =
    base !== '' && url.pathname.startsWith(base)
      ? url.pathname.slice(base.length)
      : url.pathname
  // A path equal to the base itself strips down to '', which is the root
  return (pathname === '' ? '/' : pathname) + url.search
}

export const addBaseUrl = (path: string): string => {
  const base = BASE_URL.replace(/\/$/, '')
  const cleanPath = path.replace(/^\//, '')
  return base + '/' + cleanPath
}

export const parseAppRoute = (_origin: string, url: string): AppRoute => {
  const pathname = removeBaseUrl(url)
  const page = parse(appRouter, Route.parse(pathname), pageNotFound())
  return { page }
}

export const toUrlString = (appRoute: AppRoute): string => {
  const { page } = appRoute
  const getPath = () => {
    switch (page._tag) {
      case 'PageHome':
        return format(homeMatch.formatter, {})
      case 'PageLogin':
        return format(loginMatch.formatter, {})
      case 'PageArticle':
        return format(articlesMatch.formatter, {})
      case 'PageUser':
        return format(usersMatch.formatter, {})
      case 'PageComment':
        return format(commentsMatch.formatter, {})
      case 'PageVisitor':
        return format(visitorsMatch.formatter, {})
      case 'PageSetting':
        return format(settingsMatch.formatter, {})
      case 'PageNotFound':
        return '/404'
    }
  }
  return addBaseUrl(getPath())
}
