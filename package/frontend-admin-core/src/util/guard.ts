import * as O from 'fp-ts/lib/Option'

import {
  type Destination,
  type DestinationAfterGuard,
  defaultDestination,
  loginDestination,
} from '@core/common/type/destination'
import { type Shared } from '@core/common/type/shared'

// The destination the app may show instead of `toDestination`. Signed out
// (no user and no token kept for unavailable mode), every screen but the
// login one sends to login; signed in, the login screen sends home.
// Idempotent: a guarded destination passes the guard as it is. The only
// place a `DestinationAfterGuard` is made. Review: called by the
// navigation, the boot and tests only (lint); a guarded destination
// anywhere else can open a screen without the move.
export const guardDestination = (
  shared: Shared,
  toDestination: Destination,
): DestinationAfterGuard => {
  const isLoggedIn = O.isSome(shared.user)
  const isLoginScreen = toDestination.screen._tag === 'LoginScreen'

  if (!isLoginScreen && !isLoggedIn && O.isNone(shared.token)) {
    return afterGuard(loginDestination())
  } else if (isLoginScreen && isLoggedIn) {
    return afterGuard(defaultDestination())
  } else {
    return afterGuard(toDestination)
  }
}

// The brand of each destination the guard returns (this file is its owner)
const afterGuard = (destination: Destination): DestinationAfterGuard =>
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  destination as DestinationAfterGuard
