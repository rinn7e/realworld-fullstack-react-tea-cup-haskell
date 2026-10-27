import { vi } from 'vitest'

import { type Destination } from '@/common/type/destination'
import { type Model, type Msg } from '@/type'
import { init, update } from '@/update'
import { urlWriteOf } from '@/util'

// A browser location on `url` (a path and its query). A `URL` has every
// field of `Location` the app reads.
export const locationOf = (url: string): Location =>
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  new URL(url, 'http://localhost') as unknown as Location

// Stubs what the app reads at boot (the saved color scheme), with nothing
// saved. Undo with `vi.unstubAllGlobals()`.
export const stubBrowser = (): void => {
  vi.stubGlobal('localStorage', {
    getItem: () => null,
    setItem: () => undefined,
    removeItem: () => undefined,
  })
}

// The app booted on `url`
export const bootOn = (url: string): Model => init(locationOf(url))[0]

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
