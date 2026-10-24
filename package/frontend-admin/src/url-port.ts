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

// Wraps the program's `update`. The first model (boot, where the guard may
// have redirected) replaces the URL so back doesn't return to the redirect;
// later route changes push a history entry.
export const withUrlSync =
  <M extends Model | null>(update: (msg: Msg, model: M) => [M, Cmd<Msg>]) =>
  (msg: Msg, prev: M): [M, Cmd<Msg>] => {
    const [next, cmd] = update(msg, prev)
    if (next === null) {
      return [next, cmd]
    } else {
      const nextRoute = pageModelToRoute(next.pageModel)
      if (
        // Keep what the user typed instead of rewriting it to `/404`
        nextRoute.page._tag === 'PageNotFound' ||
        (prev !== null &&
          AppRouteEq.equals(pageModelToRoute(prev.pageModel), nextRoute))
      ) {
        return [next, cmd]
      } else {
        const mode = prev === null ? 'replace' : 'push'
        return [
          next,
          Cmd.batch([cmd, writeUrlCmd(toUrlString(nextRoute), mode)]),
        ]
      }
    }
  }
