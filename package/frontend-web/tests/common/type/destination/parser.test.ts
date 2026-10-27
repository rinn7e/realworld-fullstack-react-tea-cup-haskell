import * as O from 'fp-ts/lib/Option'
import { describe, expect, it } from 'vitest'

import {
  type Destination,
  articleScreen,
  editorScreen,
  globalFeedTab,
  homeScreen,
  loginScreen,
  notFoundScreen,
  parseDestination,
  profileScreen,
  signupScreen,
  tagFeedTab,
  toUrlString,
  userFeedTab,
} from '@/common/type/destination'

const parse = (path: string) =>
  parseDestination(`http://localhost${path}`).screen

describe('parseDestination', () => {
  it('parses the home tabs and page number', () => {
    expect(parse('/')).toEqual(homeScreen(globalFeedTab(), 1))
    expect(parse('/?tab=user-feed')).toEqual(homeScreen(userFeedTab(), 1))
    expect(parse('/?tab=tag-feed&tag=react&page=3')).toEqual(
      homeScreen(tagFeedTab('react'), 3),
    )
  })

  it('falls back to the global feed and page 1 on unusable params', () => {
    expect(parse('/?tab=tag-feed')).toEqual(homeScreen(globalFeedTab(), 1))
    expect(parse('/?page=abc')).toEqual(homeScreen(globalFeedTab(), 1))
    expect(parse('/?page=0')).toEqual(homeScreen(globalFeedTab(), 1))
    expect(parse('/?page=-2')).toEqual(homeScreen(globalFeedTab(), 1))
  })

  it('parses the other screens', () => {
    expect(parse('/login')).toEqual(loginScreen())
    expect(parse('/register')).toEqual(signupScreen())
    expect(parse('/editor')).toEqual(editorScreen(O.none))
    expect(parse('/editor/my-post')).toEqual(editorScreen(O.some('my-post')))
    expect(parse('/article/my-post')).toEqual(articleScreen('my-post'))
    expect(parse('/profile/jake')).toEqual(profileScreen('jake', false))
    expect(parse('/profile/jake?favorites=true')).toEqual(
      profileScreen('jake', true),
    )
    expect(parse('/no/such/page')).toEqual(notFoundScreen())
  })
})

describe('toUrlString', () => {
  it('round-trips through parseDestination', () => {
    const destinations: Destination[] = [
      { screen: homeScreen(globalFeedTab(), 1) },
      { screen: homeScreen(tagFeedTab('react'), 2) },
      { screen: editorScreen(O.some('my-post')) },
      { screen: profileScreen('jake', true) },
    ]
    destinations.forEach((destination) => {
      expect(
        parseDestination(`http://localhost${toUrlString(destination)}`),
      ).toEqual(destination)
    })
  })

  it('omits default query params', () => {
    expect(toUrlString({ screen: homeScreen(globalFeedTab(), 1) })).toBe('/')
    expect(toUrlString({ screen: profileScreen('jake', false) })).toBe(
      '/profile/jake',
    )
  })
})
