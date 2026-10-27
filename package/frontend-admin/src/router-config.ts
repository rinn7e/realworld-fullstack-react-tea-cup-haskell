import type * as TeaRouter from '@rinn7e/tea-cup-router'
import * as O from 'fp-ts/lib/Option'
import { type Cmd } from 'tea-cup-fp'

import {
  type AppRoute,
  AppRouteEq,
  parseAppRoute,
  toUrlString,
} from '@/common/type/route'
import { type Shared } from '@/common/type/shared'

export const mkRouterConfig = <ScreenModel, Msg>(
  initScreenModel: (
    route: AppRoute,
    context: Shared,
    prev?: {
      readonly route: AppRoute
      readonly pageModel: ScreenModel
    },
  ) => [ScreenModel, Cmd<Msg>],
  toMsg: (subMsg: TeaRouter.Msg<AppRoute>) => Msg,
): TeaRouter.Config<AppRoute, ScreenModel, Shared, Msg> => ({
  parseUrl: (location) => parseAppRoute(window.location.origin, location.href),
  toUrl: toUrlString,
  routeEq: AppRouteEq,
  guard: (toRoute, shared) => {
    const isLoggedIn = O.isSome(shared.user)
    const isRouteRequiredAuth = toRoute.page._tag !== 'PageLogin'

    if (isRouteRequiredAuth && !isLoggedIn && O.isNone(shared.token)) {
      return { _tag: 'Redirect', to: { page: { _tag: 'PageLogin' } } }
    } else if (toRoute.page._tag === 'PageLogin' && isLoggedIn) {
      return { _tag: 'Redirect', to: { page: { _tag: 'PageHome' } } }
    } else {
      return { _tag: 'Allow' }
    }
  },
  initPageModel: initScreenModel,
  toMsg,
})
