import * as O from 'fp-ts/lib/Option'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { init } from '@/update'

import { locationOf, stubBrowser } from './helper/app'

describe('init', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  // `Init` arrives on a timer after the page load event; a token saved in
  // between (e.g. by a test, before a reload) must survive the boot
  it('leaves a stored token alone when booting without one', () => {
    stubBrowser()
    const removeItem = vi.fn()
    vi.stubGlobal('localStorage', {
      getItem: () => 'token-saved-after-load',
      setItem: () => undefined,
      removeItem,
    })
    init(locationOf('/'), O.none, false, O.none)
    expect(removeItem).not.toHaveBeenCalled()
  })
})
