import * as O from 'fp-ts/lib/Option'
import { Cmd, Ok } from 'tea-cup-fp'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

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
  toUrlString,
  userScreen,
  visitorScreen,
} from '@/common/type/destination'
import { type Msg } from '@/type'
import { update } from '@/update'
import { bootUrlOf, destinationOf, urlChangedMsg, withUrl } from '@/util'

import {
  bootOn,
  locationOf,
  navigate,
  step,
  stubBrowser,
  urlChanged,
  user,
} from '../helper/app'

// The URL is an adapter at the edges: the destination is read from the
// models, the URL is written from it after each step and read only at boot
// and on the browser's back and forward.

// Every screen, keyed by its tag, so a new screen fails to compile until
// the tests cover it
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

// The destinations a signed-in admin can be on (the login screen sends
// home)
const signedInDestinations: Destination[] = Object.values(screens)
  .filter((screen) => screen._tag !== 'LoginScreen')
  .map(destinationOfScreen)

const usersDestination = destinationOfScreen(userScreen())

describe('URL adapter', () => {
  beforeEach(stubBrowser)
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('boots on the destination of every URL', () => {
    signedInDestinations
      .filter((destination) => destination.screen._tag !== 'NotFoundScreen')
      .forEach((destination) => {
        expect(destinationOf(bootOn(toUrlString(destination), true))).toEqual(
          destination,
        )
      })
    expect(destinationOf(bootOn('/no/such/page', true))).toEqual(
      destinationOfScreen(notFoundScreen()),
    )
  })

  it('shows every destination after a Navigate from home', () => {
    const home = bootOn('/', true)
    signedInDestinations.forEach((destination) => {
      expect(destinationOf(step(navigate(destination), home).next)).toEqual(
        destination,
      )
    })
  })

  it('sends a signed-out boot to login, and corrects its URL with a replace', () => {
    const urlDestination = usersDestination
    const model = bootOn(toUrlString(urlDestination), false)
    expect(destinationOf(model)).toEqual(loginDestination())
    expect(bootUrlOf(urlDestination, destinationOf(model))).toEqual(
      O.some(toUrlString(loginDestination())),
    )
  })

  it('leaves the boot URL as it is when the guard keeps it', () => {
    expect(bootUrlOf(usersDestination, usersDestination)).toEqual(O.none)
  })

  it('pushes an entry for a new destination', () => {
    const { write } = step(navigate(usersDestination), bootOn('/', true))
    expect(write).toEqual(
      O.some({ _tag: 'PushUrl', url: toUrlString(usersDestination) }),
    )
  })

  it('writes nothing when the destination stays', () => {
    const home = bootOn('/', true)
    expect(step({ _tag: 'NoOp' }, home).write).toEqual(O.none)
    expect(step({ _tag: 'ScrollToTop' }, home).write).toEqual(O.none)
  })

  it('refreshes the screen shown on a click to it, with no new entry', () => {
    const onUsers = bootOn(toUrlString(usersDestination), true)
    const { next, write } = step(navigate(usersDestination), onUsers)
    expect(next.screenModel).not.toBe(onUsers.screenModel)
    expect(write).toEqual(O.none)
  })

  it("opens the browser's back as a move, never writing over its entry", () => {
    const home = bootOn('/', true)
    const { next: onUsers } = step(navigate(usersDestination), home)
    const { next: back, write } = step(
      urlChanged(defaultDestination()),
      onUsers,
    )
    expect(destinationOf(back)).toEqual(defaultDestination())
    expect(write).toEqual(O.none)
  })

  it('keeps the screen when back or forward lands on the destination shown', () => {
    const onUsers = bootOn(toUrlString(usersDestination), true)
    const { next, write } = step(urlChanged(usersDestination), onUsers)
    expect(next).toBe(onUsers)
    expect(write).toEqual(O.none)
  })

  it("corrects the browser's entry with a replace when the guard redirects its move", () => {
    const signedOut = bootOn('/login', false)
    const { next, write } = step(urlChanged(usersDestination), signedOut)
    expect(destinationOf(next)).toEqual(loginDestination())
    expect(write).toEqual(
      O.some({ _tag: 'ReplaceUrl', url: toUrlString(loginDestination()) }),
    )
  })

  it('replaces a back to the login URL while signed in with home', () => {
    const onUsers = bootOn(toUrlString(usersDestination), true)
    const { next, write } = step(urlChanged(loginDestination()), onUsers)
    expect(destinationOf(next)).toEqual(defaultDestination())
    expect(write).toEqual(
      O.some({ _tag: 'ReplaceUrl', url: toUrlString(defaultDestination()) }),
    )
  })

  it('pushes the login URL on a logout', () => {
    const onUsers = bootOn(toUrlString(usersDestination), true)
    const { next, write } = step({ _tag: 'Logout' }, onUsers)
    expect(destinationOf(next)).toEqual(loginDestination())
    expect(write).toEqual(
      O.some({ _tag: 'PushUrl', url: toUrlString(loginDestination()) }),
    )
  })

  it('pushes the home URL when the login succeeds', () => {
    const onLogin = bootOn('/login', false)
    const { next, write } = step(
      {
        _tag: 'LoginScreenMsg',
        subMsg: { _tag: 'SubmitResult', result: new Ok({ user }) },
      },
      onLogin,
    )
    expect(destinationOf(next)).toEqual(defaultDestination())
    expect(write).toEqual(
      O.some({ _tag: 'PushUrl', url: toUrlString(defaultDestination()) }),
    )
  })

  it("reads the browser's back and forward as UrlChanged", () => {
    expect(urlChangedMsg(locationOf('/users'))).toEqual(
      urlChanged(usersDestination),
    )
  })

  it("puts the URL write before the step's own Cmd", () => {
    const home = bootOn('/', true)
    const msg = navigate(usersDestination)
    const stepped = update(msg, home)
    const [next, cmd] = withUrl(msg, home, stepped)
    expect(next).toBe(stepped[0])
    expect(cmd).not.toBe(stepped[1])
    const order: string[] = []
    vi.stubGlobal('window', {
      history: {
        pushState: (_: unknown, __: string, url: string) => {
          order.push(`push ${url}`)
        },
        replaceState: () => undefined,
      },
    })
    withUrl(msg, home, [next, Cmd.none<Msg>()])[1].execute(() => undefined)
    expect(order).toEqual([`push ${toUrlString(usersDestination)}`])
  })
})
