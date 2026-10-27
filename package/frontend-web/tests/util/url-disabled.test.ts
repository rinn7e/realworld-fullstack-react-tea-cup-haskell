import * as O from 'fp-ts/lib/Option'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type * as Env from '@/common/env'
import {
  articleScreen,
  defaultDestination,
  destinationOfScreen,
  loginDestination,
  toUrlString,
} from '@/common/type/destination'
import { update } from '@/update'
import { bootUrlOf, destinationOf, urlChangedMsg, withUrl } from '@/util'

import { bootOn, locationOf, navigate, stubBrowser } from '../helper/app'

// With `VITE_DISABLE_URL` the app runs on in-app navigation alone: the URL
// wrapper neither reads nor writes the URL.
vi.mock('@/common/env', async (importOriginal) => ({
  ...(await importOriginal<typeof Env>()),
  IS_DISABLE_URL: true,
}))

const articleDestination = destinationOfScreen(articleScreen('my-post'))

describe('URL off (VITE_DISABLE_URL)', () => {
  beforeEach(() => {
    stubBrowser()
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("boots on the default destination, whatever the page's URL", () => {
    expect(
      destinationOf(bootOn(toUrlString(articleDestination), true)),
    ).toEqual(defaultDestination())
  })

  it("never corrects the boot's entry", () => {
    expect(bootUrlOf(articleDestination, loginDestination())).toEqual(O.none)
  })

  it("ignores the browser's back and forward", () => {
    expect(urlChangedMsg(locationOf('/article/my-post'))).toEqual({
      _tag: 'NoOp',
    })
  })

  it('still navigates in the app, and writes no URL', () => {
    const home = bootOn('/', true)
    const msg = navigate(articleDestination)
    const stepped = update(msg, home)
    const [next, cmd] = withUrl(msg, home, stepped)
    expect(destinationOf(next)).toEqual(articleDestination)
    // The step's own Cmd, with no URL write added in front of it
    expect(cmd).toBe(stepped[1])
  })
})
