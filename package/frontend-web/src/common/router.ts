import type * as TeaRouter from '@rinn7e/tea-cup-router'
import * as O from 'fp-ts/lib/Option'
import { type Cmd } from 'tea-cup-fp'

import { type Shared } from '@/common/type/shared'

import {
  type AppRoute,
  AppRouteEq,
  homePage,
  parseAppRoute,
  toUrlString,
} from './type/route'

export const mkRouterConfig = <PageModel, Msg>(
  initPageModel: (
    route: AppRoute,
    context: Shared,
    prev?: {
      readonly route: AppRoute
      readonly pageModel: PageModel
    },
  ) => [PageModel, Cmd<Msg>],
): TeaRouter.Config<AppRoute, PageModel, Shared, Msg> => ({
  parseUrl: (location) => parseAppRoute('', location.href),
  toUrl: toUrlString,
  routeEq: AppRouteEq,
  guard: (toRoute, shared) => {
    const isLoggedIn = O.isSome(shared.user)
    const requiresAuth =
      toRoute.page._tag === 'SettingsPage' ||
      toRoute.page._tag === 'EditorPage' ||
      (toRoute.page._tag === 'HomePage' &&
        toRoute.page.tab._tag === 'UserFeedTab')

    if (requiresAuth && !isLoggedIn) {
      return { _tag: 'Redirect', to: { page: { _tag: 'LoginPage' } } }
    }

    const requiresGuest =
      toRoute.page._tag === 'LoginPage' || toRoute.page._tag === 'SignupPage'

    if (requiresGuest && isLoggedIn) {
      return { _tag: 'Redirect', to: { page: homePage() } }
    }

    return { _tag: 'Allow' }
  },
  initPageModel,
  toMsg: (subMsg) => ({ _tag: 'TeaRouterMsg', subMsg }) as unknown as Msg,
})
