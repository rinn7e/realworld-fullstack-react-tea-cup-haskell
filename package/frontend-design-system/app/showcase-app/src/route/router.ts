import type * as TeaRouter from '@rinn7e/tea-cup-router'
import { type Cmd } from 'tea-cup-fp'

import { parseAppRoute, toUrlString } from './parser'
import { type AppRoute, AppRouteEq } from './type'

export const mkRouterConfig = <PageModel, Msg>(
  initPageModel: (
    route: AppRoute,
    context: undefined,
    prev?: {
      readonly route: AppRoute
      readonly pageModel: PageModel
    },
  ) => [PageModel, Cmd<Msg>],
  toMsg: (subMsg: TeaRouter.Msg<AppRoute>) => Msg,
): TeaRouter.Config<AppRoute, PageModel, undefined, Msg> => ({
  parseUrl: (location) => parseAppRoute('', location.href),
  toUrl: toUrlString,
  routeEq: AppRouteEq,
  guard: () => ({ _tag: 'Allow' }),
  initPageModel,
  toMsg,
})
