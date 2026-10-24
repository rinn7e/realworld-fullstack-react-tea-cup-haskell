import { describe, expect, it } from 'vitest'

import {
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

import { allRoutes } from '../../../helper/fixture'

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
  // The URL is derived from the model and parsed back on boot and on
  // back / forward, so every page `pushUrl` / `replaceUrl` write must
  // survive the round trip (not-found is never written; it passes trivially)
  it('round-trips through parseAppRoute', () => {
    allRoutes.forEach((route) => {
      expect(
        parseAppRoute('', `http://localhost${toUrlString(route)}`),
      ).toEqual(route)
    })
  })
})
