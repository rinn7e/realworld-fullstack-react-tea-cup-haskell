import * as O from 'fp-ts/lib/Option'

import {
  type Destination,
  defaultDestination,
  loginDestination,
} from '@/common/type/destination'
import { type Shared } from '@/common/type/shared'

// The destination the app may show instead of `toDestination`. Signed out
// (no user and no token kept for unavailable mode), every screen but the
// login one sends to login; signed in, the login screen sends home.
// Idempotent: a guarded destination passes the guard as it is.
export const guardDestination = (
  shared: Shared,
  toDestination: Destination,
): Destination => {
  const isLoggedIn = O.isSome(shared.user)
  const isLoginScreen = toDestination.screen._tag === 'LoginScreen'

  if (!isLoginScreen && !isLoggedIn && O.isNone(shared.token)) {
    return loginDestination()
  } else if (isLoginScreen && isLoggedIn) {
    return defaultDestination()
  } else {
    return toDestination
  }
}
