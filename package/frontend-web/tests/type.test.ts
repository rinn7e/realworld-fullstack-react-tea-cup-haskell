import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { pageModelToRoute } from '@/type'
import { initPageModel } from '@/update'

import { stubBrowser } from './helper/browser'
import { loggedIn } from './helper/fixture'
import { allRoutes } from './helper/route'

// Page inits start API calls
beforeEach(() => stubBrowser('/'))
afterEach(() => vi.unstubAllGlobals())

describe('pageModelToRoute', () => {
  // The route is derived from the open page, so opening a route must give back
  // the same route, params included. Logged in, because settings and the
  // editor show not-found to a visitor (the guard keeps visitors away).
  it('inverts initPageModel for every route', () => {
    allRoutes.forEach((route) => {
      const [pageModel] = initPageModel(route, loggedIn)
      expect(pageModelToRoute(pageModel)).toEqual(route)
    })
  })
})
