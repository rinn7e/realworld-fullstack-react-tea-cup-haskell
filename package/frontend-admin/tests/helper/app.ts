import * as O from 'fp-ts/lib/Option'
import { vi } from 'vitest'

import { type AuthUser } from '@/common/type/auth-user'
import { type Destination } from '@/common/type/destination'
import { type Model, type Msg } from '@/type'
import { init, update } from '@/update'
import { urlWriteOf } from '@/util'

export const user: AuthUser = {
  email: 'admin@example.com',
  token: 'token',
  username: 'admin',
  bio: null,
  image: null,
}

// A browser location on `url` (a path and its query). A `URL` has every
// field of `Location` the app reads.
export const locationOf = (url: string): Location =>
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  new URL(url, 'http://localhost') as unknown as Location

// Stubs what the app reads at boot (the saved token, theme and color
// scheme), with nothing saved. Undo with `vi.unstubAllGlobals()`.
export const stubBrowser = (): void => {
  vi.stubGlobal('localStorage', {
    getItem: () => null,
    setItem: () => undefined,
    removeItem: () => undefined,
  })
}

// The app booted on `url`, signed in or not
export const bootOn = (url: string, isSignedIn: boolean): Model =>
  init(
    locationOf(url),
    isSignedIn ? O.some(user) : O.none,
    false,
    isSignedIn ? O.some(user.token) : O.none,
  )[0]

// One step of the app, with the URL write it ends with
export const step = (msg: Msg, model: Model) => {
  const [next] = update(msg, model)
  return { next, write: urlWriteOf(msg, model, next) }
}

export const navigate = (destination: Destination): Msg => ({
  _tag: 'NavigationMsg',
  subMsg: { _tag: 'Navigate', destination },
})

// The browser's back or forward landed on `destination`
export const urlChanged = (destination: Destination): Msg => ({
  _tag: 'NavigationMsg',
  subMsg: { _tag: 'UrlChanged', destination },
})
