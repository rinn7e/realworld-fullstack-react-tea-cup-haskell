import { describe, expect, it } from 'vitest'

import { getSearchParams } from '@/page/comment/util'

describe('getSearchParams (comments)', () => {
  it('reads author and article prefixes', () => {
    expect(getSearchParams('author:jake')).toEqual({ author: 'jake' })
    expect(getSearchParams('@jake')).toEqual({ author: 'jake' })
    expect(getSearchParams('article: my-post')).toEqual({
      articleSlug: 'my-post',
    })
    expect(getSearchParams('slug:my-post')).toEqual({ articleSlug: 'my-post' })
  })

  it('searches by author without a prefix, and not at all when empty', () => {
    expect(getSearchParams('jake')).toEqual({ author: 'jake' })
    expect(getSearchParams('')).toEqual({})
  })
})
