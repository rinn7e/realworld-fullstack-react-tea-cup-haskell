import * as A from 'fp-ts/lib/Array'
import { pipe } from 'fp-ts/lib/function'
import { describe, expect, it } from 'vitest'

import {
  ALL_COMPONENT_ITEMS,
  parseAppRoute,
  parsePath,
  removeBaseUrl,
  toUrlString,
} from '@/common/type/route'

const parse = (path: string) => parseAppRoute('', `http://localhost${path}`)

describe('route parser', () => {
  it('parses the root and known component paths', () => {
    expect(parse('/').page._tag).toBe('HomePage')
    expect(parse('/media-object').page._tag).toBe('MediaObjectPage')
    expect(parse('/dot-loading').page._tag).toBe('DotLoadingPage')
  })

  it('falls back to NotFoundPage for unknown paths', () => {
    expect(parse('/nope').page._tag).toBe('NotFoundPage')
  })

  it('round-trips every component route through toUrlString', () => {
    pipe(
      ALL_COMPONENT_ITEMS,
      A.map((item) => {
        const route = parse(`/${item}`)
        expect(route.page._tag).not.toBe('NotFoundPage')
        expect(toUrlString(route)).toBe(`/${item}`)
      }),
    )
  })

  it('parses a bare path from a nav item href', () => {
    expect(parsePath('/box').page._tag).toBe('BoxPage')
  })

  it('strips a trailing slash from the pathname', () => {
    expect(removeBaseUrl('http://localhost/button/')).toBe('/button')
    expect(removeBaseUrl('http://localhost/')).toBe('/')
  })
})
