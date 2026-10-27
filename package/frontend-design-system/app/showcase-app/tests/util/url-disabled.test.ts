import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type * as Env from '@/common/env'
import {
  boxScreen,
  defaultDestination,
  destinationOfScreen,
} from '@/common/type/destination'
import { update } from '@/update'
import { destinationOf, urlChangedMsg, withUrl } from '@/util'

import { bootOn, locationOf, navigate, stubBrowser } from '../helper/app'

// With `VITE_DISABLE_URL` the app runs on in-app navigation alone: the URL
// wrapper neither reads nor writes the URL.
vi.mock('@/common/env', async (importOriginal) => ({
  ...(await importOriginal<typeof Env>()),
  IS_DISABLE_URL: true,
}))

const boxDestination = destinationOfScreen(boxScreen())

describe('URL off (VITE_DISABLE_URL)', () => {
  beforeEach(stubBrowser)
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("boots on the default destination, whatever the page's URL", () => {
    expect(destinationOf(bootOn('/box'))).toEqual(defaultDestination())
  })

  it("ignores the browser's back and forward", () => {
    expect(urlChangedMsg(locationOf('/box'))).toEqual({ _tag: 'NoOp' })
  })

  it('still navigates in the app, and writes no URL', () => {
    const home = bootOn('/')
    const msg = navigate(boxDestination)
    const stepped = update(msg, home)
    const [next, cmd] = withUrl(msg, home, stepped)
    expect(destinationOf(next)).toEqual(boxDestination)
    // The step's own Cmd, with no URL write added in front of it
    expect(cmd).toBe(stepped[1])
  })
})
