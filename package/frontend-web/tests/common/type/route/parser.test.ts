import * as O from 'fp-ts/lib/Option'
import { describe, expect, it } from 'vitest'

import {
  type AppRoute,
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
  it('round-trips through parseAppRoute', () => {
    const routes: AppRoute[] = [
      { page: pageHome(globalFeedTab(), 1) },
      { page: pageHome(tagFeedTab('react'), 2) },
      { page: pageEditor(O.some('my-post')) },
      { page: pageProfile('jake', true) },
    ]
    routes.forEach((route) => {
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
