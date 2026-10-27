import {
  Formatter,
  Match,
  Parser,
  Route,
  end,
  format,
  lit,
  parse,
  query,
  str,
  zero,
} from '@rinn7e/fp-ts-routing'
import { booleanFromUndefinedWithDefault } from '@rinn7e/tea-cup-prelude'
import * as O from 'fp-ts/lib/Option'
import * as t from 'io-ts'

import { BASE_URL } from '@/common/env'

import {
  type Destination,
  type HomeTab,
  type Screen,
  articleScreen,
  editorScreen,
  globalFeedTab,
  homeScreen,
  loginScreen,
  notFoundScreen,
  profileScreen,
  settingsScreen,
  signupScreen,
  tagFeedTab,
  userFeedTab,
} from './type'

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

// The only code that knows how a destination is spelled in the URL

// Parser
// ------------------------------------------------------------------

const homeParams = t.exact(
  t.partial({
    tab: t.union([
      t.literal('global-feed'),
      t.literal('user-feed'),
      t.literal('tag-feed'),
    ]),
    tag: t.string,
    page: t.string,
  }),
)

type HomeParams = t.TypeOf<typeof homeParams>

const homeMatch = query(homeParams).and(end)
const loginMatch = lit('login').and(end)
const signupMatch = lit('register').and(end)
const settingsMatch = lit('settings').and(end)
const editorMatch: Match<object> = lit('editor').and(end)
const editorSlugMatch: Match<{ slug: string }> = lit('editor')
  .and(str('slug'))
  .and(end)
const articleMatch: Match<{ slug: string }> = lit('article')
  .and(str('slug'))
  .and(end)

const profileParams = t.exact(
  t.partial({
    favorites: t.string,
  }),
)

const profileMatch = lit('profile')
  .and(str('username'))
  .and(query(profileParams))
  .and(end)

const anyStrings = new Match<object>(
  new Parser((r) => O.some([{}, new Route([], r.query)])),
  new Formatter((r) => r),
)

const tabFromParam = (
  tab: 'global-feed' | 'user-feed' | 'tag-feed' | undefined,
  tag: string | undefined,
) => {
  switch (tab) {
    case 'user-feed':
      return userFeedTab()
    case 'tag-feed':
      return tag ? tagFeedTab(tag) : globalFeedTab()
    case 'global-feed':
    default:
      return globalFeedTab()
  }
}

const tabToParams = (tab: HomeTab): HomeParams => {
  switch (tab._tag) {
    case 'GlobalFeedTab':
      return {}
    case 'UserFeedTab':
      return { tab: 'user-feed' }
    case 'TagFeedTab':
      return { tab: 'tag-feed', tag: tab.tag }
  }
}

const pageFromParam = (p: string | undefined): number => {
  if (p === undefined) {
    return 1
  } else {
    const n = parseInt(p, 10)
    // Below 1 reads as the first page, which the URL spells without `page`
    return isNaN(n) || n < 1 ? 1 : n
  }
}

const screenParser: Parser<Screen> = zero<Screen>()
  .alt(
    homeMatch.parser.map(({ tab, tag, page }) =>
      homeScreen(tabFromParam(tab, tag), pageFromParam(page)),
    ),
  )
  .alt(loginMatch.parser.map(() => loginScreen()))
  .alt(signupMatch.parser.map(() => signupScreen()))
  .alt(settingsMatch.parser.map(() => settingsScreen()))
  .alt(editorMatch.parser.map(() => editorScreen(O.none)))
  .alt(editorSlugMatch.parser.map(({ slug }) => editorScreen(O.some(slug))))
  .alt(articleMatch.parser.map(({ slug }) => articleScreen(slug)))
  .alt(
    profileMatch.parser.map(({ username, favorites }) =>
      profileScreen(
        username,
        booleanFromUndefinedWithDefault(favorites, false),
      ),
    ),
  )
  .alt(anyStrings.parser.map(() => notFoundScreen()))

// `href`: a full URL (the page's `location.href`)
export const parseDestination = (href: string): Destination => ({
  screen: parse(screenParser, Route.parse(removeBaseUrl(href)), homeScreen()),
})

// Formatter
// ------------------------------------------------------------------

export const toUrlString = (destination: Destination): string => {
  const { screen } = destination
  const getPath = () => {
    switch (screen._tag) {
      case 'HomeScreen':
        return format(homeMatch.formatter, {
          ...tabToParams(screen.tab),
          page: screen.page > 1 ? String(screen.page) : undefined,
        })
      case 'LoginScreen':
        return format(loginMatch.formatter, {})
      case 'SignupScreen':
        return format(signupMatch.formatter, {})
      case 'SettingsScreen':
        return format(settingsMatch.formatter, {})
      case 'EditorScreen':
        return O.isSome(screen.slug)
          ? format(editorSlugMatch.formatter, { slug: screen.slug.value })
          : format(editorMatch.formatter, {})
      case 'ArticleScreen':
        return format(articleMatch.formatter, { slug: screen.slug })
      case 'ProfileScreen':
        return format(profileMatch.formatter, {
          username: screen.username,
          favorites: screen.favorites ? 'true' : undefined,
        })
      case 'NotFoundScreen':
        return '404'
    }
  }

  const path = getPath()
  return addBaseUrl(path)
}
