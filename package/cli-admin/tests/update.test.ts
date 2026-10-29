import * as O from 'fp-ts/lib/Option'
import { describe, expect, it } from 'vitest'

import { destinationOfScreen, userScreen } from '@/common/type/destination'
import { currentScreenOf } from '@/type'
import { init, update } from '@/update'

import { user } from './helper/user'

const signedOut = { user: O.none, isUnavailable: false, token: O.none }
const signedIn = {
  user: O.some(user),
  isUnavailable: false,
  token: O.some(user.token),
}

describe('init', () => {
  it('boots on the login screen when signed out', () => {
    const [model] = init(signedOut)
    expect(currentScreenOf(model.screenModel)._tag).toBe('LoginScreen')
    expect(model.isTyping).toBe(false)
  })

  it('boots on the overview when the stored token is valid', () => {
    const [model] = init(signedIn)
    expect(currentScreenOf(model.screenModel)._tag).toBe('HomeScreen')
  })
})

describe('update', () => {
  it('gives the keys back to the app on a move', () => {
    const [booted] = init(signedIn)
    const [typing] = update({ _tag: 'SetTyping', isTyping: true }, booted)
    expect(typing.isTyping).toBe(true)
    const [moved] = update(
      {
        _tag: 'NavigationMsg',
        subMsg: {
          _tag: 'Navigate',
          destination: destinationOfScreen(userScreen()),
        },
      },
      typing,
    )
    expect(currentScreenOf(moved.screenModel)._tag).toBe('UserScreen')
    expect(moved.isTyping).toBe(false)
  })

  it('opens the login screen on logout', () => {
    const [booted] = init(signedIn)
    const [loggedOut] = update({ _tag: 'Logout' }, booted)
    expect(currentScreenOf(loggedOut.screenModel)._tag).toBe('LoginScreen')
    expect(O.isNone(loggedOut.shared.user)).toBe(true)
  })
})
