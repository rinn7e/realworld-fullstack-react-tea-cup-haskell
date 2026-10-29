import { Route, end, format, lit, parse, zero } from '@rinn7e/fp-ts-routing'

import { BASE_URL } from '@/common/env'

import {
  type Destination,
  type Screen,
  articleScreen,
  commentScreen,
  destinationOfScreen,
  homeScreen,
  loginScreen,
  notFoundScreen,
  settingScreen,
  userScreen,
  visitorScreen,
} from './type'

// The only code that knows how a destination is spelled in the URL

const homeMatch = end
const loginMatch = lit('login').and(end)
const articlesMatch = lit('articles').and(end)
const usersMatch = lit('users').and(end)
const commentsMatch = lit('comments').and(end)
const settingsMatch = lit('settings').and(end)
const visitorsMatch = lit('visitors').and(end)

const screenParser = zero<Screen>()
  .alt(homeMatch.parser.map(homeScreen))
  .alt(loginMatch.parser.map(loginScreen))
  .alt(articlesMatch.parser.map(articleScreen))
  .alt(usersMatch.parser.map(userScreen))
  .alt(commentsMatch.parser.map(commentScreen))
  .alt(visitorsMatch.parser.map(visitorScreen))
  .alt(settingsMatch.parser.map(settingScreen))

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

// `href`: a full URL (the page's `location.href`)
export const parseDestination = (href: string): Destination =>
  destinationOfScreen(
    parse(screenParser, Route.parse(removeBaseUrl(href)), notFoundScreen()),
  )

export const toUrlString = (destination: Destination): string => {
  const { screen } = destination
  const getPath = () => {
    switch (screen._tag) {
      case 'HomeScreen':
        return format(homeMatch.formatter, {})
      case 'LoginScreen':
        return format(loginMatch.formatter, {})
      case 'ArticleScreen':
        return format(articlesMatch.formatter, {})
      case 'UserScreen':
        return format(usersMatch.formatter, {})
      case 'CommentScreen':
        return format(commentsMatch.formatter, {})
      case 'VisitorScreen':
        return format(visitorsMatch.formatter, {})
      case 'SettingScreen':
        return format(settingsMatch.formatter, {})
      case 'NotFoundScreen':
        return '/404'
    }
  }
  return addBaseUrl(getPath())
}
