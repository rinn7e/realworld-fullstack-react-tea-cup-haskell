import * as O from 'fp-ts/lib/Option'
import { describe, expect, it } from 'vitest'

import {
  type Destination,
  articleScreen,
  defaultDestination,
  destinationOfScreen,
  editorScreen,
  globalFeedTab,
  homeScreen,
  loginDestination,
  loginScreen,
  notFoundScreen,
  profileScreen,
  settingsScreen,
  signupScreen,
  tagFeedTab,
  userFeedTab,
} from '@/common/type/destination'
import { type Shared } from '@/common/type/shared'
import { guardDestination } from '@/util'

import { user } from '../helper/app'

const open: Destination[] = [
  homeScreen(globalFeedTab(), 1),
  homeScreen(tagFeedTab('react'), 2),
  articleScreen('my-post'),
  profileScreen('jake', true),
  notFoundScreen(),
].map(destinationOfScreen)

const signedInOnly: Destination[] = [
  homeScreen(userFeedTab(), 1),
  settingsScreen(),
  editorScreen(O.none),
  editorScreen(O.some('my-post')),
].map(destinationOfScreen)

const signedOutOnly: Destination[] = [loginScreen(), signupScreen()].map(
  destinationOfScreen,
)

const signedOut: Shared = { user: O.none, token: O.none }
const signedIn: Shared = { user: O.some(user), token: O.some(user.token) }

describe('guardDestination', () => {
  it('keeps the open screens for everyone', () => {
    ;[signedOut, signedIn].forEach((shared) => {
      open.forEach((destination) => {
        expect(guardDestination(shared, destination)).toEqual(destination)
      })
    })
  })

  it('sends the signed-in screens to login when signed out', () => {
    signedInOnly.forEach((destination) => {
      expect(guardDestination(signedOut, destination)).toEqual(
        loginDestination(),
      )
      expect(guardDestination(signedIn, destination)).toEqual(destination)
    })
  })

  it('sends login and signup home when signed in', () => {
    signedOutOnly.forEach((destination) => {
      expect(guardDestination(signedIn, destination)).toEqual(
        defaultDestination(),
      )
      expect(guardDestination(signedOut, destination)).toEqual(destination)
    })
  })

  it('is idempotent', () => {
    ;[signedOut, signedIn].forEach((shared) => {
      ;[...open, ...signedInOnly, ...signedOutOnly].forEach((destination) => {
        const guarded = guardDestination(shared, destination)
        expect(guardDestination(shared, guarded)).toEqual(guarded)
      })
    })
  })
})
