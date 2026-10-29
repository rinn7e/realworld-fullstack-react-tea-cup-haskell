// Module: SentinelAdmin

import Common_Type
import Common_Type_Destination

// A destination the guard let through (`guardDestination`): the only kind a
// move opens. Owned: nothing else can make one (the initializer is file
// private), so skipping the guard does not type check. Review: a new maker in
// this file skips the guard.
struct DestinationAfterGuard: Equatable {
  let destination: Destination

  fileprivate init(_ destination: Destination) {
    self.destination = destination
  }
}

// The destination the app may show instead of `toDestination`. Signed out (no
// user and no token kept for unavailable mode), every screen but the login one
// sends to login; signed in, the login screen sends home. Idempotent: a guarded
// destination passes the guard as it is. The only place a
// `DestinationAfterGuard` is made. Review: called by the navigation, the boot
// and tests only; a guarded destination anywhere else can open a screen
// without the move.
func guardDestination(_ shared: Shared, _ toDestination: Destination) -> DestinationAfterGuard {
  let isLoggedIn = shared.user != nil
  let isLoginScreen = toDestination.screen == .loginScreen

  if !isLoginScreen && !isLoggedIn && shared.token == nil {
    return DestinationAfterGuard(loginDestination())
  } else if isLoginScreen && isLoggedIn {
    return DestinationAfterGuard(defaultDestination())
  } else {
    return DestinationAfterGuard(toDestination)
  }
}
