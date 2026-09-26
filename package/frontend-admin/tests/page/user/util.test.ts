import { describe, expect, it } from 'vitest'

import { getSearchParams } from '@/page/user/util'

describe('getSearchParams (users)', () => {
  it('reads username and email prefixes', () => {
    expect(getSearchParams('username: jake')).toEqual({ username: 'jake' })
    expect(getSearchParams('@jake')).toEqual({ username: 'jake' })
    expect(getSearchParams('email:jake@x.io')).toEqual({ email: 'jake@x.io' })
  })

  it('searches by username without a prefix, and not at all when empty', () => {
    expect(getSearchParams('jake')).toEqual({ username: 'jake' })
    expect(getSearchParams('')).toEqual({})
  })
})
