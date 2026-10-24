import { describe, expect, it } from 'vitest'

import { pageModelToRoute } from '@/type'
import { initPageModel } from '@/update'

import { allRoutes, loggedOut } from './helper/fixture'

describe('pageModelToRoute', () => {
  // The route is derived from the open page, so opening a route must give back
  // the same route
  it('inverts initPageModel for every route', () => {
    allRoutes.forEach((route) => {
      const [pageModel] = initPageModel(route, loggedOut)
      expect(pageModelToRoute(pageModel)).toEqual(route)
    })
  })
})
