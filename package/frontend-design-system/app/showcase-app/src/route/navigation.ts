import type * as Navigation from '@rinn7e/tea-cup-navigation'
import { type Cmd } from 'tea-cup-fp'

import { parseAppRoute, toUrlString } from './parser'
import { type AppRoute, AppRouteEq } from './type'

export const mkNavigationConfig = <PageModel, Msg>(
  initPageModel: (
    route: AppRoute,
    context: undefined,
    prev?: {
      readonly route: AppRoute
      readonly pageModel: PageModel
    },
  ) => [PageModel, Cmd<Msg>],
): Navigation.Config<AppRoute, PageModel, undefined, Msg> => ({
  parseUrl: (location) => parseAppRoute('', location.href),
  toUrl: toUrlString,
  routeEq: AppRouteEq,
  guard: () => ({ _tag: 'Allow' }),
  initPageModel,
  toMsg: (subMsg) => ({ _tag: 'NavigationMsg', subMsg }) as unknown as Msg,
})
