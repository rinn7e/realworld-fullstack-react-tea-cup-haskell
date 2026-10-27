import * as A from 'fp-ts/lib/Array'
import { pipe } from 'fp-ts/lib/function'
import { describe, expect, it } from 'vitest'

import {
  ALL_COMPONENT_ITEMS,
  ITEM_SCREENS,
  destinationOfScreen,
  parseDestination,
  removeBaseUrl,
  toUrlString,
} from '@/common/type/destination'

const parse = (path: string) => parseDestination(`http://localhost${path}`)

describe('destination parser', () => {
  it('parses the root and known component paths', () => {
    expect(parse('/').screen._tag).toBe('HomeScreen')
    expect(parse('/media-object').screen._tag).toBe('MediaObjectScreen')
    expect(parse('/dot-loading').screen._tag).toBe('DotLoadingScreen')
  })

  it('falls back to NotFoundScreen for unknown paths', () => {
    expect(parse('/nope').screen._tag).toBe('NotFoundScreen')
  })

  it('round-trips every component screen through toUrlString', () => {
    pipe(
      ALL_COMPONENT_ITEMS,
      A.map((item) => {
        const destination = destinationOfScreen(ITEM_SCREENS[item])
        expect(toUrlString(destination)).toBe(`/${item}`)
        expect(parse(toUrlString(destination))).toEqual(destination)
      }),
    )
  })

  it('strips a trailing slash from the pathname', () => {
    expect(removeBaseUrl('http://localhost/button/')).toBe('/button')
    expect(removeBaseUrl('http://localhost/')).toBe('/')
  })
})
