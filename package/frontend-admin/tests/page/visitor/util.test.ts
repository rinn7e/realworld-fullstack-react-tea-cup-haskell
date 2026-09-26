import { describe, expect, it } from 'vitest'

import { getSearchParams } from '@/page/visitor/util'

describe('getSearchParams (visitors)', () => {
  it('treats text starting with / as a path, anything else as an IP', () => {
    expect(getSearchParams(' /articles ')).toEqual({ path: '/articles' })
    expect(getSearchParams('127.0.0.1')).toEqual({ ip: '127.0.0.1' })
  })

  it('does not search when empty', () => {
    expect(getSearchParams('   ')).toEqual({})
  })
})
