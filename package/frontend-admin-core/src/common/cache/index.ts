import { cmdSucceed } from '@rinn7e/tea-cup-prelude'
import { type Cmd } from 'tea-cup-fp'

import { platform } from '@core/platform'

// The session token, kept where the app's platform keeps it

export const loadToken = (): string | null => platform().loadToken()

export const saveTokenCmd = (token: string): Cmd<{ _tag: 'NoOp' }> =>
  cmdSucceed(() => {
    platform().saveToken(token)
  })

export const removeTokenCmd = (): Cmd<{ _tag: 'NoOp' }> =>
  cmdSucceed(() => {
    platform().removeToken()
  })
