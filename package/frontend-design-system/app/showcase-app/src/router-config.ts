import type * as TeaRouter from '@rinn7e/tea-cup-router'
import { type Cmd } from 'tea-cup-fp'

import {
  type AppRoute,
  AppRouteEq,
  parseAppRoute,
  toUrlString,
} from '@/common/type/route'

export const mkRouterConfig = <ScreenModel, Msg>(
  initScreenModel: (
    route: AppRoute,
    context: undefined,
    prev?: {
      readonly route: AppRoute
      readonly pageModel: ScreenModel
    },
  ) => [ScreenModel, Cmd<Msg>],
  toMsg: (subMsg: TeaRouter.Msg<AppRoute>) => Msg,
): TeaRouter.Config<AppRoute, ScreenModel, undefined, Msg> => ({
  parseUrl: (location) => parseAppRoute('', location.href),
  toUrl: toUrlString,
  routeEq: AppRouteEq,
  guard: () => ({ _tag: 'Allow' }),
  initPageModel: initScreenModel,
  toMsg,
})
