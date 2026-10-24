import * as O from 'fp-ts/lib/Option'
import { describe, expect, it } from 'vitest'

import {
  globalFeedTab,
  pageArticle,
  pageEditor,
  pageHome,
  pageLogin,
  pageNotFound,
  pageProfile,
  pageSignup,
  parseAppRoute,
  tagFeedTab,
  toUrlString,
  userFeedTab,
} from '@/common/type/route'

import { allRoutes } from '../../../helper/route'

const parse = (path: string) =>
  parseAppRoute('', `http://localhost${path}`).page

describe('parseAppRoute', () => {
  it('parses the home tabs and page number', () => {
    expect(parse('/')).toEqual(pageHome(globalFeedTab(), 1))
    expect(parse('/?tab=user-feed')).toEqual(pageHome(userFeedTab(), 1))
    expect(parse('/?tab=tag-feed&tag=react&page=3')).toEqual(
      pageHome(tagFeedTab('react'), 3),
    )
  })

  it('falls back to the global feed and page 1 on unusable params', () => {
    expect(parse('/?tab=tag-feed')).toEqual(pageHome(globalFeedTab(), 1))
    expect(parse('/?page=abc')).toEqual(pageHome(globalFeedTab(), 1))
    expect(parse('/?page=0')).toEqual(pageHome(globalFeedTab(), 1))
    expect(parse('/?page=-2')).toEqual(pageHome(globalFeedTab(), 1))
  })

  it('parses the other pages', () => {
    expect(parse('/login')).toEqual(pageLogin())
    expect(parse('/register')).toEqual(pageSignup())
    expect(parse('/editor')).toEqual(pageEditor(O.none))
    expect(parse('/editor/my-post')).toEqual(pageEditor(O.some('my-post')))
    expect(parse('/article/my-post')).toEqual(pageArticle('my-post'))
    expect(parse('/profile/jake')).toEqual(pageProfile('jake', false))
    expect(parse('/profile/jake?favorites=true')).toEqual(
      pageProfile('jake', true),
    )
    expect(parse('/no/such/page')).toEqual(pageNotFound())
  })
})

describe('toUrlString', () => {
  // The URL is derived from the model and parsed back on boot and on
  // back / forward, so every page `pushUrl` / `replaceUrl` write must
  // survive the round trip (not-found is never written; it passes trivially)
  it('round-trips through parseAppRoute', () => {
    allRoutes.forEach((route) => {
      expect(
        parseAppRoute('', `http://localhost${toUrlString(route)}`),
      ).toEqual(route)
    })
  })

  it('omits default query params', () => {
    expect(toUrlString({ page: pageHome(globalFeedTab(), 1) })).toBe('/')
    expect(toUrlString({ page: pageProfile('jake', false) })).toBe(
      '/profile/jake',
    )
  })
})
