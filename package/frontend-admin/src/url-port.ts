import { Cmd, Task } from 'tea-cup-fp'

import { AppRouteEq, toUrlString } from '@/common/type/route'

import { type Model, type Msg, pageModelToRoute } from './type'

// The URL is a view of the model: after every update it is derived from
// the open page (`pageModelToRoute`) and written to the address bar. The app reads the URL only
// when it comes from outside: at boot (`init`) and on browser back / forward
// (`UrlChange`). It never reads back a URL it wrote itself, so the writer uses
// `history` directly and, unlike `newUrl` from react-tea-cup, fires no
// `popstate`.

const writeUrlCmd = (url: string, mode: 'push' | 'replace'): Cmd<Msg> =>
  Task.perform(
    Task.succeed(undefined).andThen(() => {
      if (url !== window.location.pathname + window.location.search) {
        if (mode === 'push') {
          window.history.pushState({}, '', url)
        } else {
          window.history.replaceState({}, '', url)
        }
      }
      return Task.succeed(undefined)
    }),
    (): Msg => ({ _tag: 'NoOp' }),
  )

// Wraps the program's `update`. A route change pushes a history entry. Anything
// else replaces, so the URL still follows the model without adding entries: at
// boot (where the guard may have redirected), and when back / forward lands on
// a URL the guard redirects to the page already shown (e.g. back to
// `/settings` after logout keeps the login page, and the URL must say so).
export const withUrlSync =
  <M extends Model | null>(update: (msg: Msg, model: M) => [M, Cmd<Msg>]) =>
  (msg: Msg, prev: M): [M, Cmd<Msg>] => {
    const [next, cmd] = update(msg, prev)
    if (next === null) {
      return [next, cmd]
    } else {
      const nextRoute = pageModelToRoute(next.pageModel)
      // Keep what the user typed instead of rewriting it to `/404`
      if (nextRoute.page._tag === 'PageNotFound') {
        return [next, cmd]
      } else {
        const isRouteChange =
          prev !== null &&
          !AppRouteEq.equals(pageModelToRoute(prev.pageModel), nextRoute)
        const mode = isRouteChange ? 'push' : 'replace'
        return [
          next,
          Cmd.batch([cmd, writeUrlCmd(toUrlString(nextRoute), mode)]),
        ]
      }
    }
  }
