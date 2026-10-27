import * as O from 'fp-ts/lib/Option'
import { vi } from 'vitest'

import { type UserWithToken } from '@/common/api'
import { type Destination } from '@/common/type/destination'
import { type Model, type Msg } from '@/type'
import { init, update } from '@/update'
import { urlWriteOf } from '@/util'

export const user: UserWithToken = {
  email: 'jake@example.com',
  token: 'token',
  username: 'jake',
  bio: null,
  image: null,
}

// A browser location on `url` (a path and its query). A `URL` has every
// field of `Location` the app reads.
export const locationOf = (url: string): Location =>
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  new URL(url, 'http://localhost') as unknown as Location

// Stubs what the app touches while building its steps: the saved token and
// color scheme (nothing saved), and `fetch`, which the visitor tracking
// calls as its command is built. Requests never answer, and the path of
// every visit is recorded. Undo with `vi.unstubAllGlobals()`.
export const stubBrowser = (): { readonly visits: string[] } => {
  const visits: string[] = []
  vi.stubGlobal('localStorage', {
    getItem: () => null,
    setItem: () => undefined,
    removeItem: () => undefined,
  })
  vi.stubGlobal('fetch', (url: string, init?: { body?: string }) => {
    if (url.endsWith('/visitors') && typeof init?.body === 'string') {
      const body: unknown = JSON.parse(init.body)
      if (typeof body === 'object' && body !== null && 'path' in body) {
        visits.push(String(body.path))
      }
    }
    return new Promise(() => undefined)
  })
  return { visits }
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
