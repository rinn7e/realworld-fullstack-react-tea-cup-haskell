import type * as TeaRouter from '@rinn7e/tea-cup-router'
import * as O from 'fp-ts/lib/Option'
import { type Cmd } from 'tea-cup-fp'

import {
  type AppRoute,
  AppRouteEq,
  pageHome,
  parseAppRoute,
  toUrlString,
} from '@/common/type/route'
import { type Shared } from '@/common/type/shared'

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
  parseUrl: (location) => parseAppRoute('', location.href),
  toUrl: toUrlString,
  routeEq: AppRouteEq,
  guard: (toRoute, shared) => {
    const isLoggedIn = O.isSome(shared.user)
    const requiresAuth =
      toRoute.page._tag === 'PageSettings' ||
      toRoute.page._tag === 'PageEditor' ||
      (toRoute.page._tag === 'PageHome' &&
        toRoute.page.tab._tag === 'UserFeedTab')

    if (requiresAuth && !isLoggedIn) {
      return { _tag: 'Redirect', to: { page: { _tag: 'PageLogin' } } }
    } else {
      const requiresGuest =
        toRoute.page._tag === 'PageLogin' || toRoute.page._tag === 'PageSignup'

      if (requiresGuest && isLoggedIn) {
        return { _tag: 'Redirect', to: { page: pageHome() } }
      } else {
        return { _tag: 'Allow' }
      }
    }
  },
  initPageModel,
  toMsg,
})
