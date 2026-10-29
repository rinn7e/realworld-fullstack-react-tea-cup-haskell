import * as O from 'fp-ts/lib/Option'
import { describe, expect, it } from 'vitest'

import {
  type Destination,
  type Screen,
  articleScreen,
  commentScreen,
  defaultDestination,
  destinationOfScreen,
  homeScreen,
  loginDestination,
  loginScreen,
  notFoundScreen,
  settingScreen,
  userScreen,
  visitorScreen,
} from '@core/common/type/destination'
import { type Shared } from '@core/common/type/shared'
import { guardDestination } from '@core/util'

import { user } from '../helper/user'

const screens: { [K in Screen['_tag']]: Screen } = {
  HomeScreen: homeScreen(),
  LoginScreen: loginScreen(),
  ArticleScreen: articleScreen(),
  UserScreen: userScreen(),
  CommentScreen: commentScreen(),
  VisitorScreen: visitorScreen(),
  SettingScreen: settingScreen(),
  NotFoundScreen: notFoundScreen(),
}

const destinations: Destination[] =
  Object.values(screens).map(destinationOfScreen)

const signedOut: Shared = { user: O.none, token: O.none }
const signedIn: Shared = { user: O.some(user), token: O.some(user.token) }
// The server was unavailable at boot: no user, but the token is kept
const unavailable: Shared = { user: O.none, token: O.some(user.token) }

describe('guardDestination', () => {
  it('sends every screen but login to login when signed out', () => {
    destinations.forEach((destination) => {
      expect(guardDestination(signedOut, destination)).toEqual(
        loginDestination(),
      )
    })
  })

  it('sends login home and keeps the rest when signed in', () => {
    destinations.forEach((destination) => {
      expect(guardDestination(signedIn, destination)).toEqual(
        destination.screen._tag === 'LoginScreen'
          ? defaultDestination()
          : destination,
      )
    })
  })

  it('keeps every screen in unavailable mode', () => {
    destinations.forEach((destination) => {
      expect(guardDestination(unavailable, destination)).toEqual(destination)
    })
  })

  it('is idempotent', () => {
    ;[signedOut, signedIn, unavailable].forEach((shared) => {
      destinations.forEach((destination) => {
        const guarded = guardDestination(shared, destination)
        expect(guardDestination(shared, guarded)).toEqual(guarded)
      })
    })
  })
})
