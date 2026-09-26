import * as O from 'fp-ts/lib/Option'
import { describe, expect, it } from 'vitest'

import {
  type AppRoute,
  articlePage,
  editorPage,
  globalFeedTab,
  homePage,
  loginPage,
  notFoundPage,
  parseAppRoute,
  profilePage,
  signupPage,
  tagFeedTab,
  toUrlString,
  userFeedTab,
} from '@/common/type/route'

const parse = (path: string) =>
  parseAppRoute('', `http://localhost${path}`).page

describe('parseAppRoute', () => {
  it('parses the home tabs and page number', () => {
    expect(parse('/')).toEqual(homePage(globalFeedTab(), 1))
    expect(parse('/?tab=user-feed')).toEqual(homePage(userFeedTab(), 1))
    expect(parse('/?tab=tag-feed&tag=react&page=3')).toEqual(
      homePage(tagFeedTab('react'), 3),
    )
  })

  it('falls back to the global feed and page 1 on unusable params', () => {
    expect(parse('/?tab=tag-feed')).toEqual(homePage(globalFeedTab(), 1))
    expect(parse('/?page=abc')).toEqual(homePage(globalFeedTab(), 1))
  })

  it('parses the other pages', () => {
    expect(parse('/login')).toEqual(loginPage())
    expect(parse('/register')).toEqual(signupPage())
    expect(parse('/editor')).toEqual(editorPage(O.none))
    expect(parse('/editor/my-post')).toEqual(editorPage(O.some('my-post')))
    expect(parse('/article/my-post')).toEqual(articlePage('my-post'))
    expect(parse('/profile/jake')).toEqual(profilePage('jake', false))
    expect(parse('/profile/jake?favorites=true')).toEqual(
      profilePage('jake', true),
    )
    expect(parse('/no/such/page')).toEqual(notFoundPage())
  })
})

describe('toUrlString', () => {
  it('round-trips through parseAppRoute', () => {
    const routes: AppRoute[] = [
      { page: homePage(globalFeedTab(), 1) },
      { page: homePage(tagFeedTab('react'), 2) },
      { page: editorPage(O.some('my-post')) },
      { page: profilePage('jake', true) },
    ]
    routes.forEach((route) => {
      expect(
        parseAppRoute('', `http://localhost${toUrlString(route)}`),
      ).toEqual(route)
    })
  })

  it('omits default query params', () => {
    expect(toUrlString({ page: homePage(globalFeedTab(), 1) })).toBe('/')
    expect(toUrlString({ page: profilePage('jake', false) })).toBe(
      '/profile/jake',
    )
  })
})
