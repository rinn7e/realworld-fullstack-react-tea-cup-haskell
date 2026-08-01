import {
  Formatter,
  Match,
  Parser,
  Route,
  end,
  format,
  parse,
  str,
  zero,
} from '@rinn7e/fp-ts-routing'
import * as O from 'fp-ts/lib/Option'

import {
  ALL_COMPONENT_ITEMS,
  type AppPage,
  type AppRoute,
  type ComponentItem,
  componentPage,
  homePage,
  notFoundPage,
} from './type'

export const removeBaseUrl = (href: string): string => {
  try {
    const url = new URL(href, window.location.origin)
    return (url.pathname || '/') + url.search
  } catch {
    return href
  }
}

export const addBaseUrl = (path: string): string => {
  const cleanPath = path.replace(/^\//, '')
  return '/' + cleanPath
}

// Router Matchers
const homeMatch = end
const componentMatch: Match<{ component: string }> = str('component').and(end)
const anyStrings = new Match<object>(
  new Parser((r) => O.some([{}, new Route([], r.query)])),
  new Formatter((r) => r),
)

const isComponentItem = (s: string): s is ComponentItem =>
  (ALL_COMPONENT_ITEMS as string[]).includes(s)

const appRouter: Parser<AppPage> = zero<AppPage>()
  .alt(homeMatch.parser.map(() => homePage()))
  .alt(
    componentMatch.parser.map(({ component }) =>
      isComponentItem(component) ? componentPage(component) : notFoundPage(),
    ),
  )
  .alt(anyStrings.parser.map(() => notFoundPage()))

export const parseAppRoute = (_mainUrl: string, href: string): AppRoute => {
  const pathname = removeBaseUrl(href)
  const page = parse(appRouter, Route.parse(pathname), homePage())
  return { page }
}

export const toUrlString = (r: AppRoute): string => {
  const page = r.page
  const getPath = () => {
    switch (page._tag) {
      case 'HomePage':
        return format(homeMatch.formatter, {})
      case 'ComponentPage':
        return format(componentMatch.formatter, { component: page.component })
      case 'NotFoundPage':
        return '404'
    }
  }

  const path = getPath()
  return addBaseUrl(path)
}
