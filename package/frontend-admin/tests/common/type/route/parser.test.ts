import { describe, expect, it } from 'vitest'

import {
  type AppRoute,
  articlesPage,
  commentsPage,
  homePage,
  loginPage,
  notFoundPage,
  parseAppRoute,
  settingsPage,
  toUrlString,
  usersPage,
  visitorsPage,
} from '@/common/type/route'

const parse = (path: string) =>
  parseAppRoute('', `http://localhost${path}`).page

describe('parseAppRoute', () => {
  it('parses every page and falls back to not found', () => {
    expect(parse('/')).toEqual(homePage())
    expect(parse('/login')).toEqual(loginPage())
    expect(parse('/articles')).toEqual(articlesPage())
    expect(parse('/users')).toEqual(usersPage())
    expect(parse('/comments')).toEqual(commentsPage())
    expect(parse('/visitors')).toEqual(visitorsPage())
    expect(parse('/settings')).toEqual(settingsPage())
    expect(parse('/no/such/page')).toEqual(notFoundPage())
  })
})

describe('toUrlString', () => {
  it('round-trips through parseAppRoute', () => {
    const routes: AppRoute[] = [
      { page: homePage() },
      { page: usersPage() },
      { page: settingsPage() },
    ]
    routes.forEach((route) => {
      expect(
        parseAppRoute('', `http://localhost${toUrlString(route)}`),
      ).toEqual(route)
    })
  })
})
