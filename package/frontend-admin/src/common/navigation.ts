import type * as Navigation from '@rinn7e/tea-cup-navigation'
import * as O from 'fp-ts/lib/Option'
import { type Cmd } from 'tea-cup-fp'

import { type AppRoute, AppRouteEq } from '@/common/type/route'
import { type Shared } from '@/common/type/shared'
import { parseAppRoute, toUrlString } from '@/common/util/route'

export const mkNavigationConfig = <PageModel, Msg>(
  initPageModel: (
    route: AppRoute,
    context: Shared,
    prev?: {
      readonly route: AppRoute
      readonly pageModel: PageModel
    },
  ) => [PageModel, Cmd<Msg>],
): Navigation.Config<AppRoute, PageModel, Shared, Msg> => ({
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
  toMsg: (subMsg) => ({ _tag: 'NavigationMsg', subMsg }) as unknown as Msg,
})
