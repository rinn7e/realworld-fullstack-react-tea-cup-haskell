import { afterEach, describe, expect, it, vi } from 'vitest'

import { pageNotFound, pageUsers } from '@/common/type/route'
import { pushUrl, replaceUrl } from '@/common/util/url'

import { runCmd, stubBrowser } from '../../helper/browser'

afterEach(() => vi.unstubAllGlobals())

describe('pushUrl / replaceUrl', () => {
  it('write the route URL with push or replace', async () => {
    const writes = stubBrowser('/')
    await runCmd(pushUrl({ page: pageUsers() }))
    expect(writes).toEqual([['push', '/users']])

    const writes2 = stubBrowser('/')
    await runCmd(replaceUrl({ page: pageUsers() }))
    expect(writes2).toEqual([['replace', '/users']])
  })

  // Clicking the page already open must not add a history entry
  it('write nothing when the address bar already shows the URL', async () => {
    const writes = stubBrowser('/users')
    await runCmd(pushUrl({ page: pageUsers() }))
    await runCmd(replaceUrl({ page: pageUsers() }))
    expect(writes).toEqual([])
  })

  // Keep what the user typed instead of rewriting it to `/404`
  it('never write the not-found page', async () => {
    const writes = stubBrowser('/no/such/page')
    await runCmd(pushUrl({ page: pageNotFound() }))
    await runCmd(replaceUrl({ page: pageNotFound() }))
    expect(writes).toEqual([])
  })
})
