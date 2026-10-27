import * as O from 'fp-ts/lib/Option'

import {
  type Destination,
  defaultDestination,
  loginDestination,
} from '@/common/type/destination'
import { type Shared } from '@/common/type/shared'

// The destination the app may show instead of `toDestination`. Signed
// out, the settings, the editor and the home user feed send to login;
// signed in, login and signup send home. Idempotent: a guarded destination
// passes the guard as it is.
export const guardDestination = (
  shared: Shared,
  toDestination: Destination,
): Destination => {
  const isLoggedIn = O.isSome(shared.user)
  const { screen } = toDestination
  const requiresAuth =
    screen._tag === 'SettingsScreen' ||
    screen._tag === 'EditorScreen' ||
    (screen._tag === 'HomeScreen' && screen.tab._tag === 'UserFeedTab')
  const requiresGuest =
    screen._tag === 'LoginScreen' || screen._tag === 'SignupScreen'

  if (requiresAuth && !isLoggedIn) {
    return loginDestination()
  } else if (requiresGuest && isLoggedIn) {
    return defaultDestination()
  } else {
    return toDestination
  }
}
