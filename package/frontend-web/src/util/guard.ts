import * as O from 'fp-ts/lib/Option'

import {
  type Destination,
  type DestinationAfterGuard,
  defaultDestination,
  loginDestination,
} from '@/common/type/destination'
import { type Shared } from '@/common/type/shared'

// The destination the app may show instead of `toDestination`. Signed
// out, the settings, the editor and the home user feed send to login;
// signed in, login and signup send home. Idempotent: a guarded destination
// passes the guard as it is. The only place a `DestinationAfterGuard` is
// made. Review: called by the navigation, the boot and tests only (lint); a
// guarded destination anywhere else can open a screen without the move.
export const guardDestination = (
  shared: Shared,
  toDestination: Destination,
): DestinationAfterGuard => {
  const isLoggedIn = O.isSome(shared.user)
  const { screen } = toDestination
  const requiresAuth =
    screen._tag === 'SettingsScreen' ||
    screen._tag === 'EditorScreen' ||
    (screen._tag === 'HomeScreen' && screen.tab._tag === 'UserFeedTab')
  const requiresGuest =
    screen._tag === 'LoginScreen' || screen._tag === 'SignupScreen'

  if (requiresAuth && !isLoggedIn) {
    return afterGuard(loginDestination())
  } else if (requiresGuest && isLoggedIn) {
    return afterGuard(defaultDestination())
  } else {
    return afterGuard(toDestination)
  }
}

// The brand of each destination the guard returns (this file is its owner)
const afterGuard = (destination: Destination): DestinationAfterGuard =>
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  destination as DestinationAfterGuard
