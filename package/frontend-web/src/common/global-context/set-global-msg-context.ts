import type * as TeaRouter from '@rinn7e/tea-cup-router'
import { createContext } from 'react'
import type { Dispatcher } from 'tea-cup-fp'

import type { AppRoute } from '@/common/type/route'

// Carries only the root `TeaRouterMsg` case, so shared components (e.g. `Link`)
// never depend on the root `Msg`; the root `dispatch` is assignable to it as-is.
export type GlobalRouterMsg = {
  readonly _tag: 'TeaRouterMsg'
  readonly subMsg: TeaRouter.Msg<AppRoute>
}

// No sensible default dispatcher exists; the provider always supplies the real one
export const SetGlobalMsgContext = createContext<Dispatcher<GlobalRouterMsg>>(
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  null as any,
)
SetGlobalMsgContext.displayName = 'SetGlobalMsgContext'
