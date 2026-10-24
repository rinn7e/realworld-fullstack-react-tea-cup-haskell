import * as O from 'fp-ts/lib/Option'
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
} from '@/common/type/route'
import { type Shared } from '@/common/type/shared'
import { pageModelToRoute } from '@/type'
import { initPageModel } from '@/update'

const shared: Shared = { user: O.none, token: O.none }

describe('pageModelToRoute', () => {
  // The route is derived from the open page, so opening a route must give back
  // the same route
  it('inverts initPageModel for every route', () => {
    const routes: AppRoute[] = [
      { page: pageHome() },
      { page: pageLogin() },
      { page: pageArticles() },
      { page: pageUsers() },
      { page: pageComments() },
      { page: pageVisitors() },
      { page: pageSettings() },
      { page: pageNotFound() },
    ]
    routes.forEach((route) => {
      const [pageModel] = initPageModel(route, shared)
      expect(pageModelToRoute(pageModel)).toEqual(route)
    })
  })
})
