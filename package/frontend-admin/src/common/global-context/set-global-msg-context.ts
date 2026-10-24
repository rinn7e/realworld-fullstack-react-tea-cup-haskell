import { createContext } from 'react'
import type { Dispatcher } from 'tea-cup-fp'

import type { AppRoute } from '@/common/type/route'

// Carries only the root `Navigate` case, so shared components (e.g. `Link`)
// never depend on the root `Msg`; the root `dispatch` is assignable to it as-is.
export type GlobalNavigateMsg = {
  readonly _tag: 'Navigate'
  readonly route: AppRoute
}

// No sensible default dispatcher exists; the provider always supplies the real one
export const SetGlobalMsgContext = createContext<Dispatcher<GlobalNavigateMsg>>(
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  null as any,
)
SetGlobalMsgContext.displayName = 'SetGlobalMsgContext'
