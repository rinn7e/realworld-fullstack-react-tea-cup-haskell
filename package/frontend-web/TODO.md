# tea-cup-realworld

- [x] Update all api handlers to accept token: Option<string> instead of token?: string or no token at all

- [x] Make mobile view looks good

- [x] Fix all errors

- [x] Host on github

- [x] Fix form no validation

- [x] Add 'Your Feed'

- [x] Add pagination to homepage

- [ ] Add e2e, make all the test pass

- [ ] Update e2e test cases to use test id instead of class

- [ ] Analyze e2e test such that we can re-create it for other project

- [ ] Make a re-use pagination component and use everywhere

- [ ] fix tags link in homepage

- [ ] Implement haskell backend, the official api is buggy

## Bugs

- [ ] Visitor tracking runs IO outside a Cmd: `trackVisitorCmd` (`src/handler/navigation-handler.ts`) calls `trackVisitor`, which starts the `fetch` while the Cmd is being built, inside `update`. Make the request start only when the Cmd runs.

- [ ] Unavailable mode never ends: `unavailableMode` is set once at boot and never cleared, so a login after the server recovers still shows "Connecting". Replace `unavailableMode` and `shared.user` with one auth state (signed in, signed out, unavailable), like the e2e `getAuthState`.

- [ ] The `SetUser` message is never sent (dead code). Remove it with the auth state rework above.

- [ ] "Your Feed" shows for signed-out visitors, and clicking it sends them to login. Hide the tab when signed out.

## extra

- [x] Port to elm

- [ ] Port to miso

- [ ] Port to other elm/tea frameworks
