package app.util

import common.type.Shared
import common.type.destination.Destination
import common.type.destination.Screen
import common.type.destination.defaultDestination
import common.type.destination.loginDestination

/**
 * A destination the guard let through (`guardDestination`): the only kind a
 * move opens. Owned: nothing else can make one (the constructor is private, and
 * only `guard` below calls it), so skipping the guard does not type check.
 * Review: a new maker in this class skips the guard.
 */
@ConsistentCopyVisibility
data class DestinationAfterGuard private constructor(val destination: Destination) {
  companion object {
    // The destination the app may show instead of `toDestination`. Signed out
    // (no user and no token kept for unavailable mode), every screen but the
    // login one sends to login; signed in, the login screen sends home.
    // Idempotent: a guarded destination passes the guard as it is.
    internal fun guard(shared: Shared, toDestination: Destination): DestinationAfterGuard {
      val isLoggedIn = shared.user != null
      val isLoginScreen = toDestination.screen == Screen.LoginScreen
      return when {
        !isLoginScreen && !isLoggedIn && shared.token == null -> DestinationAfterGuard(loginDestination())
        isLoginScreen && isLoggedIn -> DestinationAfterGuard(defaultDestination())
        else -> DestinationAfterGuard(toDestination)
      }
    }
  }
}

// The only way to a `DestinationAfterGuard`. Review: called by the navigation,
// the boot and tests only; a guarded destination anywhere else can open a
// screen without the move.
fun guardDestination(shared: Shared, toDestination: Destination): DestinationAfterGuard =
  DestinationAfterGuard.guard(shared, toDestination)
