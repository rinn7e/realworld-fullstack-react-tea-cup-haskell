import type * as TeaRouter from '@rinn7e/tea-cup-router'
import * as O from 'fp-ts/lib/Option'
import { type Cmd } from 'tea-cup-fp'

import { type AppRoute, AppRouteEq } from '@/common/type/route'
import { type Shared } from '@/common/type/shared'
import { parseAppRoute, toUrlString } from '@/common/util/route'

export const mkRouterConfig = <PageModel, Msg>(
  initPageModel: (
    route: AppRoute,
    context: Shared,
    prev?: {
      readonly route: AppRoute
      readonly pageModel: PageModel
    },
  ) => [PageModel, Cmd<Msg>],
  toMsg: (subMsg: TeaRouter.Msg<AppRoute>) => Msg,
): TeaRouter.Config<AppRoute, PageModel, Shared, Msg> => ({
  parseUrl: (location) => parseAppRoute(window.location.origin, location.href),
  toUrl: toUrlString,
  routeEq: AppRouteEq,
  guard: (toRoute, shared) => {
    const isLoggedIn = O.isSome(shared.user)
    const isRouteRequiredAuth = toRoute.page._tag !== 'LoginPage'

    if (isRouteRequiredAuth && !isLoggedIn && O.isNone(shared.token)) {
      return { _tag: 'Redirect', to: { page: { _tag: 'LoginPage' } } }
    }

    if (toRoute.page._tag === 'LoginPage' && isLoggedIn) {
      return { _tag: 'Redirect', to: { page: { _tag: 'HomePage' } } }
    }

    return { _tag: 'Allow' }
  },
  initPageModel,
  toMsg,
})
