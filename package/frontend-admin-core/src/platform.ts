import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'

// What the core needs from the app that runs it: where the API is, and
// where the session token is kept (the browser's `localStorage`, a file
// for the CLI). Each app sets it once at startup (`setPlatform`), before
// its program starts.
export type Platform = {
  readonly apiBase: string
  readonly loadToken: () => string | null
  readonly saveToken: (token: string) => void
  readonly removeToken: () => void
}

// The one piece of state of the core, written only by `setPlatform`
const current: { platform: O.Option<Platform> } = { platform: O.none }

export const setPlatform = (platform: Platform): void => {
  current.platform = O.some(platform)
}

export const platform = (): Platform =>
  pipe(
    current.platform,
    O.getOrElse((): Platform => {
      throw new Error('setPlatform must be called before the program starts')
    }),
  )
