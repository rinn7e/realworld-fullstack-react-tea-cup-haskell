import { createContext } from 'react'
import type { Dispatcher } from 'tea-cup-fp'

import type { Msg } from '../type'

export const SetGlobalMsgContext = createContext<Dispatcher<Msg>>(() => {
  console.warn('SetGlobalMsgContext not provided')
})
