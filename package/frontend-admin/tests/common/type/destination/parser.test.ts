import { describe, expect, it } from 'vitest'

import {
  type Destination,
  articleScreen,
  commentScreen,
  destinationOfScreen,
  homeScreen,
  loginScreen,
  notFoundScreen,
  parseDestination,
  settingScreen,
  toUrlString,
  userScreen,
  visitorScreen,
} from '@/common/type/destination'

const parse = (path: string) =>
  parseDestination(`http://localhost${path}`).screen

describe('parseDestination', () => {
  it('parses every screen and falls back to not found', () => {
    expect(parse('/')).toEqual(homeScreen())
    expect(parse('/login')).toEqual(loginScreen())
    expect(parse('/articles')).toEqual(articleScreen())
    expect(parse('/users')).toEqual(userScreen())
    expect(parse('/comments')).toEqual(commentScreen())
    expect(parse('/visitors')).toEqual(visitorScreen())
    expect(parse('/settings')).toEqual(settingScreen())
    expect(parse('/no/such/page')).toEqual(notFoundScreen())
  })
})

describe('toUrlString', () => {
  it('round-trips every screen but not found through parseDestination', () => {
    const destinations: Destination[] = [
      homeScreen(),
      loginScreen(),
      articleScreen(),
      userScreen(),
      commentScreen(),
      visitorScreen(),
      settingScreen(),
    ].map(destinationOfScreen)
    destinations.forEach((destination) => {
      expect(
        parseDestination(`http://localhost${toUrlString(destination)}`),
      ).toEqual(destination)
    })
  })
})
