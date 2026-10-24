# Migrating from tea-cup-router to model-owned navigation

A living record of moving the frontends off `@rinn7e/tea-cup-router` to
navigation owned by the model, with the URL as a view of the model. It
documents the process and the gotchas, so later migrations can follow it.

## Status

| App | State | Where |
| --- | --- | --- |
| frontend-admin | Done | on `master` (see [Log](#log)) |
| frontend-web | Done | on `master` (see [Log](#log)) |
| design-system showcase-app | Done | on `master` (see [Log](#log)); the last user of `tea-cup-router` in this repo |
| `tea-cup-url` package | Decided, after frontend-web | see [Decision](#decision-extract-tea-cup-url-deprecate-tea-cup-router) |

## Why

With tea-cup-router, every navigation round-trips through the browser:

    Msg -> build URL -> pushState -> popstate -> parse URL -> guard -> init page

The URL acts as a second source of truth sitting inside the control loop. The
router needs several message variants and an `isInternal` flag mostly to
suppress the echo of its own URL changes, and the router model keeps the route
next to the page model.

The new design, in Elm terms (`Browser.application`):

- **The model owns navigation.** The open page model is the single source of
  truth.
- **The handler that changes the page returns the URL write**, like Elm's
  `Nav.pushUrl` / `Nav.replaceUrl` (and the elm-spa-example's
  `Route.replaceUrl`).
- **The URL is parsed only when it comes from outside:** at boot (pasted link,
  refresh, new tab) and on `popstate` (browser back / forward, Elm's
  `onUrlChange = UrlChanged`).

```
boot        --> parse --> guard --> init page        + replaceUrl
Navigate    --> guard --> init page                  + pushUrl
UrlChanged  --> parse --> guard --> init page if the route changed  + replaceUrl
```

## Target shape (as built in frontend-admin)

### Model: one source of truth

```ts
export type Model = {
  readonly pageModel: PageModel   // no `route`, no `router`
  readonly shared: Shared
  // ...
}

// Every route is derivable from the open page
export const pageModelToRoute = (pageModel: PageModel): AppRoute => { ... }
```

### Msg: one way in, one way from outside

```ts
| { readonly _tag: 'Navigate'; readonly route: AppRoute }
// Browser back / forward: the only URL change that comes from outside after boot
| { readonly _tag: 'UrlChanged'; readonly url: URL }
```

`UrlChanged` carries a standard `URL` (Elm's `Url`), built in `program.tsx`:
`onUrlChange={(location) => ({ _tag: 'UrlChanged', url: new URL(location.href) })}`.
That keeps the handler free of `window` and easy to test.

### URL commands: `common/util/url.ts`

```ts
export const pushUrl = (route: AppRoute): Cmd<{ _tag: 'NoOp' }>     // new history entry
export const replaceUrl = (route: AppRoute): Cmd<{ _tag: 'NoOp' }>  // no new entry
```

Both are `cmdSucceed` commands (the admin convention's way to put IO in a
`Cmd`, like `scrollToTopCmd`). They write with `window.history` directly and
fire no `popstate`, skip the write when the address bar already shows the URL,
and never write the not-found page (keep what the user typed).

### update: each handler returns its own URL write

```ts
export const guardRoute = (route: AppRoute, shared: Shared): AppRoute => ...

// Guarded route -> page; the caller adds the URL write
const openPage = (route, model) => ...

// Always (re)initializes the page, also the current one
export const navigateHandler = (route, model) => {
  const guarded = guardRoute(route, model.shared)
  const [next, pageCmd] = openPage(guarded, model)
  return [next, Cmd.batch([pageCmd, pushUrl(guarded).map(noOpToMsg)])]
}

// Keeps the page when the guarded route is the one already shown; always replaces
export const urlChangedHandler = (url, model) => {
  const route = guardRoute(parseAppRoute(url.origin, url.href), model.shared)
  const [next, pageCmd] = sameRoute ? [model, Cmd.none()] : openPage(route, model)
  return [next, Cmd.batch([pageCmd, replaceUrl(route).map(noOpToMsg)])]
}
```

`init` parses the boot URL once, guards it, initializes the page and returns
`replaceUrl(route)`. Logout and login success call `navigateHandler`
directly, so they get `pushUrl` with it.

### Link: a real anchor

A plain `<a href={toUrlString(route)}>` whose left click (no modifier keys)
calls `preventDefault` and dispatches `Navigate` through
`SetGlobalMsgContext`. Ctrl / Cmd / Shift click and middle click keep the
browser's behaviour (new tab, copy link).

### What gets deleted

`router-config.ts`, the `TeaRouterMsg` message, `TeaRouter.Model` in the root,
every `TeaRouter.getRoute` / `getPageModel` / `setPageModel`, the
`RouterLink` import, and the `@rinn7e/tea-cup-router` dependency.
`fp-ts-routing` stays: `parseAppRoute` / `toUrlString` are the URL codec and
did not change.

## Process

The order that worked for frontend-admin. Steps 2 to 4 break the type checker
in between, so do them in one go.

1. **Sensors first.**
   1. Round-trip test for every route: `parseAppRoute(toUrlString(r))`
      gives `r` back. Run it before touching anything: if it fails, today's
      parser and formatter already disagree.
   2. Count the router uses you are about to remove (`TeaRouterMsg` senders,
      `getRoute` / `getPageModel` / `setPageModel`). They must reach zero.
2. **Root types.** Replace `router` in the `Model` with `pageModel`; replace
   `TeaRouterMsg` with `Navigate` and `UrlChanged`; add `pageModelToRoute`.
3. **update.** Move the guard out of the router config into `guardRoute`;
   add `openPage`, `navigateHandler` (+ `pushUrl`) and `urlChangedHandler`
   (+ `replaceUrl`); parse the boot URL in `init` (+ `replaceUrl`); replace
   router accessors with plain fields; make logout and login call
   `navigateHandler`.
4. **URL commands, program, Link, global-msg context.** Add
   `common/util/url.ts`, map `onUrlChange` to `UrlChanged` with a `URL`,
   rewrite `Link`, retype the global-msg context to carry `Navigate`.
5. **Delete** the router config and remove the dependency
   (`pnpm remove @rinn7e/tea-cup-router` in the package).
6. **Gate:** format, `check`, `check-circular`, `lint`, `test`.
7. **Test for real** (see [Manual test recipe](#manual-test-recipe)). Do not
   stop at the unit tests or at JavaScript-driven clicks.
8. **Independent review** by a fresh agent that gets the diff and the old
   router's source, not your conclusions. Loop until it approves.

## Gotchas

1. **`newUrl` from react-tea-cup fires a `popstate` after `pushState`.**
   That is the echo the old router suppressed with `isInternal`. The new
   commands call `window.history.pushState` / `replaceState` directly and
   never dispatch `popstate`. (Elm does fire `onUrlChange` after its own
   `pushUrl`; that echo is harmless there because handling `UrlChanged` for
   the route already shown changes nothing. The essential property is that
   handling a URL change is idempotent, not that there is no echo.)
2. **Do not store the route next to the page model.** The first version kept
   `route` and `pageModel` in the `Model`: the same fact twice, so "route says
   Home, page says Users" was representable. Derive the route
   (`pageModelToRoute`) and test that it inverts `initPageModel` for every
   route. This needs every route param to live in the page model.
3. **No `update` wrapper.** An intermediate version wrapped `update` in
   `program.tsx` to derive and write the URL after every message. It broke
   the rule that dispatching `XMsg` and calling `xMsgHandler` give the same
   result: `navigateHandler` called from `logoutHandler` returned no URL write,
   and the wrapper chose push or replace by looking at `msg._tag`. It also
   caused gotcha 4. Each handler returns its own `pushUrl` / `replaceUrl`
   instead.
4. **Endless `NoOp` loop.** With the wrapper writing on every update, the
   write command answered with `NoOp`, `NoOp` triggered another update, so
   another write: an update about every 4ms on every page, invisible on
   screen. Found by the independent review, not by manual testing. Nothing
   that runs on every message may return a command that answers with a
   message.
5. **Boot must replace, not push.** A guard redirect at boot (`/articles` ->
   `/login` when logged out) would otherwise leave a history entry that back
   bounces off.
6. **Back / forward always replaces, even when the route did not change.**
   Bug found in real testing: after logout, browser back to `/settings` is
   guarded to the login page that is already shown, so nothing changes, and
   the address bar stays on `/settings`. Replacing on every `UrlChanged` fixes
   it, and never pushing there keeps the forward history (back to an old
   `/login` while logged in is guarded to `/` and replaced, not pushed).
7. **Same-route semantics.** Kept from the old router: an in-app click on the
   current page re-initializes it (a refresh), and back / forward to the route
   already shown keeps the page as it is. Changed on purpose: the click no
   longer adds a history entry (the old `newUrl` always pushed a duplicate);
   `pushUrl` skips the write when the URL is already shown.
8. **Not found: do not rewrite the URL.** `toUrlString` turns the not-found
   page into `/404`; writing it would replace what the user typed.
9. **`UrlChanged` arrives on the next tick.** `ProgramWithNav` dispatches it
   from a `setTimeout`, so a screenshot taken right after back / forward shows
   the previous frame. Wait before asserting.
10. **Commands run on a timer.** react-tea-cup executes every `Cmd` from a
    `setTimeout`, so a URL write lands a few milliseconds after its update. The
    write compares with `window.location` when it runs. Keeping writes limited
    to navigations (no per-update writes) narrows the window in which a queued
    push can overwrite a back / forward pressed in between to the few
    milliseconds after a click; it does not close it. Accepted as is.
11. **`Navigate` to the not-found page keeps the previous URL.** The URL
    commands never write the not-found page, so navigating to it in-app would
    show 404 while the address bar keeps the last page. Nothing links to it,
    so it is only representable, not reachable.
12. **The guard must be idempotent:** `guardRoute(guardRoute(r)) =
    guardRoute(r)`. The old router re-ran the guard on its own redirect target;
    the new code runs it once. Tested for every route and session.
13. **Trailing slashes are canonicalized; query strings give 404.**
    `replaceUrl` at boot writes `toUrlString(route)`, so `/users/` becomes
    `/users`. A query string is not dropped: the admin's routes end with the
    `fp-ts-routing` fork's `end`, which rejects any query, so `/users?x=1`
    (and `/?x=1`, and `/admin/users?x=1` under the production base) parses to
    the not-found page. The URL is kept (not-found is never written) and a
    logged-in user sees 404; a logged-out one is guarded to `/login`. Same as
    on master, not a regression. An app with query state must put those params
    in its codec, or every link with a query will 404. frontend-web does: its
    home and profile routes parse `query(...)` before `end`, so `?tab=`,
    `&tag=`, `&page=` and `?favorites=` round-trip. Boot canonicalizes them
    too: unknown params are dropped (`/?page=1&foo=bar` becomes `/`), and a
    page number below 1 is read as page 1 (otherwise the page would show page
    0 while the written URL, omitting the default page, read as page 1).
14. **Base path deploys were reviewed, not tested.** `toUrlString` adds
    `BASE_URL` (`/admin/` in production) and the write compares with
    `location.pathname`, which includes the base. The review found it
    consistent; only the root base (`/`) was run in a browser.
15. **JavaScript-driven tests missed gotcha 6; manual tests missed gotcha 4.**
    Calling `.click()` and `history.back()` from JavaScript did not hit the
    logout + back case: it only showed with the real backend, a real login,
    real clicks and the browser's own back button. The loop showed on no
    screen at all: only the review caught it. Use all three: unit tests,
    real-browser tests, independent review.

Added by frontend-web:

16. **Route params move into the page models.** `pageModelToRoute` can only
    derive what the page model holds. The profile page model had no
    `username` (the root read it from the route and passed it to
    `ProfilePage.update`), so it gained a `username` field and `update` lost
    the parameter. Check every page's params before starting: home `tab` +
    `pagination.page`, profile `username` + `showFavorites`, article and editor
    `slug`. Move the views too: the profile view first kept reading `username`
    from a `route` prop the root derived for it, a second input for the same
    fact that its `Props` type let disagree with the model. It now reads
    `model.username`, and the `route` prop is gone.
17. **"Change the route without reloading" becomes plain derivation.** The old
    `ChangeRouteNoReload` (home tab, home page, profile favorites) updated the
    router's route and the URL but kept the page. Now the page updates its own
    state as before, and the root handler for that page's message derives the
    route after the child update, compares it with the route before, and on a
    change returns the route-change effects and `pushUrl`
    (`pageRouteChangedHandler`). Only for the messages that change params
    (`ChangeTab`, `ChangePage`, `ToggleFavorites`), named in the handler, so it
    stays explicit and is not a per-message diff.
18. **Keep the old router's side effects on route change.** web's
    `routerMsgHandler` closed the sidebar and sent a visitor-tracking call
    whenever the route changed, and closed the sidebar on every `UrlChange`.
    That included the `popstate` echo of every in-app navigation, so the
    sidebar also closed on a click to the route already shown. Now:
    `routeChangedHandler` (close the sidebar, record the visit) runs on every
    real route change, from `navigateHandler`, `urlChangedHandler` and
    `pageRouteChangedHandler`; the sidebar alone also closes on a same-route
    `Navigate` and on every back / forward. Read the old router message
    handler, echo included, for such effects before deleting it.
19. **Widen the model when setting the page.** `{ ...model, pageModel: { _tag:
    'HomePageModel', model } }` keeps the literal page type, and `updateAndCmd`
    then infers a model narrowed to one page. `TeaRouter.setPageModel` used to
    return a widened type. A small `withPageModel(model, pageModel): Model`
    helper restores it.
20. **Test environment for root tests.** Tests that import the root `update`
    pull in packages whose ESM builds import `fp-ts` without extensions: add
    them to `test.server.deps.inline` in `vite.config.ts`
    (`@rinn7e/tea-cup-pagination`, `@rinn7e/realworld-design-system`). The
    browser stub must also cover `document` (color scheme), `scrollTo`,
    `matchMedia` and `fetch`. `fetch` must never settle: the app starts
    requests while building commands (`trackVisitor` calls `fetch` inside
    `update`, a pre-existing side effect left as is), and a rejected request
    nobody runs is an unhandled rejection.
21. **"Flaky" e2e tests can be real bugs.** 13 e2e tests failed on their
    first attempt and passed on retry, on master too. Run with
    `--retries=0` and one at a time, they failed every time. The cause was in
    the app, not the tests: `init` called `removeToken()` when booting without
    a token, but `init` runs from the `Init` message, a command that executes
    on a timer after the page load event. A token saved right after load (the
    tests save one, then reload) was deleted before the reload, so the app
    booted logged out instead of in unavailable mode. Removing that call
    (redundant: `initializeCmd` already saves or removes the stored token from
    the server's answer) fixed all 13. frontend-admin had the same call in its
    `init` (no e2e suite there to show it); removed too, with a unit test that
    boots without a token while one is stored and checks it survives.
22. **Read app state only after the app booted.** One e2e test read the token
    right after `page.reload()` through `window.__conduit_debug__?.getToken()`,
    which is `null` until the app has booted. It passed alone and failed under
    parallel load. Waiting for an element the app renders (here `Connecting`)
    before reading fixes it.
23. **Check baselines properly.** A fresh `git worktree` of master did not
    build: the design system's `dist/` is gitignored, so the master app showed
    a Vite error overlay and every test "failed" for that reason alone. Copy
    or build `package/frontend-design-system/dist` before trusting a baseline
    run.

## Manual test recipe

Run the real stack:

1. Postgres running locally (the backend's `.envrc` has `DB_CONN`).
2. Backend: `cd package/backend && direnv exec . make api` (port 3000).
3. Frontend: `pnpm --dir package/frontend-admin dev` (port 5174).
4. A local admin account. The seed admins' passwords are not documented, so
   for frontend-admin a local test user was registered through
   `POST /api/users` and promoted with
   `UPDATE "user" SET role='AdminRole' WHERE email=...` in the local
   database. Its credentials are in `package/backend/.env.test-admin.local`
   (gitignored).

Scenarios:

| Scenario | Expected |
| --- | --- |
| Logged out, paste a protected URL | Login page, URL replaced with `/login` |
| Log in through the form | Home page with live data, URL `/` |
| Click through the sidebar with the mouse | URL follows, page loads, no reload, one history entry per page |
| Click the page already open | Page refreshes, no new history entry |
| Browser back / forward | Screen follows the URL, no new entries, forward still works |
| Paste a URL while logged in, then refresh | Same page after reload |
| Paste `/login` while logged in | Guard sends you to `/` |
| Paste an unknown URL | 404 page, URL kept as typed |
| Sign out | Login page, token cleared, one history entry |
| Back after sign out | Login page stays, URL corrected to `/login`, no new entry |
| Ctrl / Cmd click a link | Opens in a new tab |
| Leave a page idle | No updates in the background (no loop) |

Check "no reload" by setting a marker on `window` before clicking and reading
it after. Check "no loop" by counting `popstate` listener registrations while
idle: react-tea-cup re-registers its listener after every update.

## Applying this to the next apps

### frontend-web (done)

Where it differed from the admin (see gotchas 16 to 23 and the log):

- Route params (`slug`, `username`, `favorites`) and the home page's `tab`
  and `page` in the URL: `pageModelToRoute` needed them in the page models
  (the profile page gained `username`). The codec already parsed the query
  params (gotcha 13).
- It has an e2e suite (`package/e2e`): kept green, and running it with
  retries off found the token race of gotcha 21. Paste, refresh and back /
  forward were checked by hand in a real browser; dedicated e2e tests for
  them are still to write.

### design-system showcase-app (done)

`package/frontend-design-system/app/showcase-app`. The simplest of the three:
42 pages, none with params, no guard, no auth, no e2e. Differences from the
admin:

- No guard, so boot's `replaceUrl` only tidies the typed URL (`/box/` ->
  `/box`), and `urlChangedHandler` has nothing to redirect.
- Navigation starts from design-system nav items (sidebar `ClickItem`,
  navbar `ClickNavItem`), whose `href` is parsed with `parsePath` and handed
  to `navigateHandler`; the not-found page's button dispatches `Navigate`.
  There is no `Link` component: the design-system `GenericLink` renders the
  anchor.
- `pageModelToRoute` is 42 one-line cases; `tests/type.test.ts` checks it
  inverts `initPageModel` for every route.

## Decision: extract `tea-cup-url`, deprecate `tea-cup-router`

Decided 2026-10-24, to be done **after frontend-web is migrated**.

In the new design `tea-cup-router`'s core job, owning the route, belongs to
the model, so most of the library has no role left: `TeaRouter.Model`, the
router messages, `isInternal`, `getRoute` / `getPageModel` / `setPageModel`
and the guard resolution. What stays generic is small and gets copied into
every migrated app:

- `pushUrl` / `replaceUrl` (generic over the route type, given `toUrl` and an
  optional "do not write this route" predicate for the not-found page);
- `Link` (a real anchor, the modifier-key check, dispatching `Navigate`);
- the pattern itself (boot: parse, guard, init, replace; `Navigate`: guard,
  init, push; `UrlChanged`: parse, guard, init if changed, replace).

Plan:

1. Migrate frontend-web, so there are two copies of the URL commands and
   `Link` and their generic shape is proven against route params and owner
   state.
2. Extract those into a new small package, `tea-cup-url`. A new name rather
   than a `tea-cup-router` v2, because the job is different: it **reflects**
   the model in the URL instead of **owning** the route.
3. Mark `tea-cup-router` deprecated, pointing to `tea-cup-url` and this doc.
4. Other apps on `tea-cup-router` move to `tea-cup-url`.

`fp-ts-routing` is not affected: it stays as the URL codec.

## Log

### frontend-admin (2026-10-24)

- 8 pages, no params, `AppRoute = { page }`. Router uses before: 1
  `getRoute`, 7 `getPageModel`, 6 `setPageModel`; senders: `Link`, logout,
  login. After: 0.
- `9f2d43d`: model-owned navigation, a URL port wrapping `update`, plain
  `Link`, dependency removed, round-trip and `pageModelToRoute` tests.
- `a796ec4`: wrapper writes on every update (fixes gotcha 6), which caused
  gotcha 4.
- Review round 1 found the loop (gotcha 4), push on guarded back / forward,
  query string handling (gotcha 13, first misdescribed as "dropped"), and thin
  tests.
- Follow-up commit: no wrapper; `pushUrl` / `replaceUrl` returned by the
  handlers (gotcha 3); Elm-style names (`UrlChanged` with a `URL`); tests for
  the guard (including idempotence), `init`, `navigateHandler`,
  `urlChangedHandler`, `update` on `NoOp` and the URL commands. The handler
  tests stub `window` (`tests/helper/browser.ts`), run the returned commands
  and assert the exact push / replace writes, so the bug of gotcha 6 fails a
  test (checked by mutating the handler). A shared fixture is keyed by every
  page tag, so a new page fails to compile until the tests cover it.
- Review round 2 found that the first handler tests checked models only, not
  URL writes; fixed as above.
- Review round 3 found no code problems (it also checked the `/admin/` base
  with a scratch test). It corrected gotcha 13 (query strings give 404, not
  dropped) and gotcha 7, and asked for logout and login-success tests, which
  were added.
- Not covered: owner state and per-owner codecs (none in the admin),
  notifications, e2e, base path deploy in a browser.

### frontend-web (2026-10-24)

- 8 pages, 4 with params: home `tab` + `page` (query), article and editor
  `slug`, profile `username` + `favorites` (query). Router uses before: 6
  `getRoute`, 9 `getPageModel`, 7 `setPageModel`; 9 `ChangeRoute`, 3
  `ChangeRouteNoReload`. After: 0. The parser and formatter round-tripped
  every sample route before any change.
- Same design as the admin, plus gotchas 16 to 20: profile `username` moved
  into the page model, the three no-reload route changes became
  `pageRouteChangedHandler`, the sidebar reset and visitor tracking moved to
  `routeChangedHandler`, a `withPageModel` widening helper, and the test
  environment for root tests.
- 35 unit tests (20 new) at first, 37 after the review fixups,
  mutation-checked (breaking the page-owned URL update or the back / forward
  replace fails 3 and 2 tests).
- e2e: 139 tests. First run: 126 passed, 13 flaky. With `--retries=0` the 13
  failed every time, on master too; root cause and fix in gotcha 21, plus one
  test-side race (gotcha 22). After: 139 passed with retries off.
- Review: approved, with nits fixed as follow-ups: page numbers below 1
  clamped to 1, the sidebar also closes on a same-route click (as the old
  echo did), tests for not-found never being written, the sidebar on all
  three kinds of navigation, and the token race; doc mismatches corrected.
- Real browser with the backend: login, tag / feed / page clicks (URL
  updates with no reload), back / forward through them, pasting a URL with
  query params, profile favorites toggle, logout and back to `/settings`
  (URL corrected to `/login`), no updates while idle.

### design-system showcase-app (2026-10-25)

- 42 pages, no params. Router uses before: 1 `getRoute`, 43 `getPageModel`,
  42 `setPageModel`, 2 `ChangeRoute`. After: 0, and `@rinn7e/tea-cup-router`
  is gone from the lockfile.
- 17 new unit tests (22 in the app), mutation-checked: pushing replaced by
  replacing in `navigateHandler`, no boot `replaceUrl`, back / forward always
  reopening the page, and no back / forward `replaceUrl` each fail 1 to 3
  tests.
- Real browser: `/box/` tidied to `/box` with no new entry, sidebar and navbar
  clicks push, back / forward stay in the same document and show the right
  page, a pasted unknown URL shows the 404 page and keeps the URL, its button
  pushes `/`, clicking the active link adds no entry, refresh keeps the page,
  no console errors.
- Review: approved with no code problems. Nits fixed: leftover `routerModel`
  names renamed, tests for `Navigate` and `UrlChanged` through `update`.
  It also found an older bug outside the migration: the sidebar and navbar
  never highlight the open page, because `app.tsx` turns `PageBox` into
  `pagebox` instead of the item id `box`. Fixed after: `activeComponentOf`
  in `common/constant/menu.tsx` reads the item id off the route's URL.
