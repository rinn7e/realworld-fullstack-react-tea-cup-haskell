import { cmdSucceed } from '@rinn7e/tea-cup-prelude'
import { type Cmd } from 'tea-cup-fp'

import { type AppRoute, toUrlString } from '@/common/type/route'

// The URL is a view of the model: the handler that changes the open page also
// returns `pushUrl` / `replaceUrl` for it, like Elm's `Nav.pushUrl` and the
// elm-spa-example's `Route.replaceUrl`. The app parses the URL only when it
// comes from outside: at boot and on browser back / forward (`UrlChanged`). It
// never parses a URL it wrote itself, so these write with `history` directly
// and, unlike `newUrl` from react-tea-cup, fire no `popstate`.

// Writes the route's URL unless the address bar already shows it. The
// not-found page is never written, to keep what the user typed instead of
// rewriting it to `/404`.
const writeRouteUrl = (
  route: AppRoute,
  write: (url: string) => void,
): Cmd<{ _tag: 'NoOp' }> =>
  cmdSucceed(() => {
    const url = toUrlString(route)
    if (
      route.page._tag !== 'PageNotFound' &&
      url !== window.location.pathname + window.location.search
    ) {
      write(url)
    }
  })

// A new history entry: an in-app navigation
export const pushUrl = (route: AppRoute): Cmd<{ _tag: 'NoOp' }> =>
  writeRouteUrl(route, (url) => window.history.pushState({}, '', url))

// No new history entry: boot (so a guard redirect leaves no entry to bounce
// off) and back / forward (which must not cut off the forward history)
export const replaceUrl = (route: AppRoute): Cmd<{ _tag: 'NoOp' }> =>
  writeRouteUrl(route, (url) => window.history.replaceState({}, '', url))
