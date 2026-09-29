import { describe, expect, it } from 'vitest'

import {
  type AppRoute,
  pageArticles,
  pageComments,
  pageHome,
  pageLogin,
  pageNotFound,
  pageSettings,
  pageUsers,
  pageVisitors,
  parseAppRoute,
  toUrlString,
} from '@/common/type/route'

const parse = (path: string) =>
  parseAppRoute('', `http://localhost${path}`).page

describe('parseAppRoute', () => {
  it('parses every page and falls back to not found', () => {
    expect(parse('/')).toEqual(pageHome())
    expect(parse('/login')).toEqual(pageLogin())
    expect(parse('/articles')).toEqual(pageArticles())
    expect(parse('/users')).toEqual(pageUsers())
    expect(parse('/comments')).toEqual(pageComments())
    expect(parse('/visitors')).toEqual(pageVisitors())
    expect(parse('/settings')).toEqual(pageSettings())
    expect(parse('/no/such/page')).toEqual(pageNotFound())
  })
})

describe('toUrlString', () => {
  it('round-trips through parseAppRoute', () => {
    const routes: AppRoute[] = [
      { page: pageHome() },
      { page: pageUsers() },
      { page: pageSettings() },
    ]
    routes.forEach((route) => {
      expect(
        parseAppRoute('', `http://localhost${toUrlString(route)}`),
      ).toEqual(route)
    })
  })
})
