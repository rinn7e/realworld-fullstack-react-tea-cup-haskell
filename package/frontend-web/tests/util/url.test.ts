import * as RD from '@devexperts/remote-data-ts'
import * as O from 'fp-ts/lib/Option'
import { Cmd, Ok } from 'tea-cup-fp'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  type Destination,
  articleScreen,
  defaultDestination,
  destinationOfScreen,
  editorScreen,
  globalFeedTab,
  homeScreen,
  loginDestination,
  notFoundScreen,
  profileScreen,
  settingsScreen,
  tagFeedTab,
  toUrlString,
  userFeedTab,
} from '@/common/type/destination'
import { type Model, type Msg } from '@/type'
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
// models (with its params from their owners), the URL is written from it
// after each step and read only at boot and on the browser's back and
// forward.

// The destinations a signed-in reader can be on, with every param
const signedInDestinations: Destination[] = [
  homeScreen(globalFeedTab(), 1),
  homeScreen(userFeedTab(), 1),
  homeScreen(tagFeedTab('react'), 3),
  articleScreen('my-post'),
  settingsScreen(),
  editorScreen(O.none),
  editorScreen(O.some('my-post')),
  profileScreen('jake', false),
  profileScreen('jake', true),
].map(destinationOfScreen)

const articleDestination = destinationOfScreen(articleScreen('my-post'))
const settingsDestination = destinationOfScreen(settingsScreen())
const profileDestination = destinationOfScreen(profileScreen('jake', false))

const homeScreenMsg = (
  subMsg: Extract<Msg, { _tag: 'HomeScreenMsg' }>['subMsg'],
): Msg => ({
  _tag: 'HomeScreenMsg',
  subMsg,
})

describe('URL adapter', () => {
  let browser: { readonly visits: string[] }
  beforeEach(() => {
    browser = stubBrowser()
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('boots on the destination of every URL', () => {
    signedInDestinations.forEach((destination) => {
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

  it('sends a signed-out boot on a guarded URL to login, and corrects its URL with a replace', () => {
    const model = bootOn(toUrlString(settingsDestination), false)
    expect(destinationOf(model)).toEqual(loginDestination())
    expect(bootUrlOf(settingsDestination, destinationOf(model))).toEqual(
      O.some(toUrlString(loginDestination())),
    )
  })

  it('pushes an entry for a new destination, and records the visit', () => {
    const { write } = step(navigate(articleDestination), bootOn('/', true))
    expect(write).toEqual(
      O.some({ _tag: 'PushUrl', url: toUrlString(articleDestination) }),
    )
    expect(browser.visits).toContain(toUrlString(articleDestination))
  })

  it('writes nothing and records no visit when the destination stays', () => {
    const home = bootOn('/', true)
    browser.visits.length = 0
    expect(step({ _tag: 'NoOp' }, home).write).toEqual(O.none)
    expect(step(navigate(defaultDestination()), home).write).toEqual(O.none)
    expect(browser.visits).toEqual([])
  })

  it('closes the mobile menu on every move, also to the destination shown', () => {
    const home = bootOn('/', true)
    const { next: open } = step(
      { _tag: 'SidebarMsg', subMsg: { _tag: 'Toggle', open: true } },
      home,
    )
    expect(open.sidebar).not.toEqual(home.sidebar)
    expect(step(navigate(defaultDestination()), open).next.sidebar).toEqual(
      home.sidebar,
    )
  })

  it('follows a home tab switch with a push, without opening the screen again', () => {
    const home = bootOn('/', true)
    const { next: withTags } = step(
      homeScreenMsg({
        _tag: 'GetTagsResponse',
        result: new Ok({ tags: ['react'] }),
      }),
      home,
    )
    const tab = tagFeedTab('react')
    const { next, write } = step(
      homeScreenMsg({ _tag: 'ChangeTab', tab }),
      withTags,
    )
    const tagFeed = destinationOfScreen(homeScreen(tab, 1))
    expect(destinationOf(next)).toEqual(tagFeed)
    expect(write).toEqual(
      O.some({ _tag: 'PushUrl', url: toUrlString(tagFeed) }),
    )
    // Opening the home screen again would fetch the tags again
    expect(
      next.screenModel._tag === 'HomeScreenModel' &&
        RD.isSuccess(next.screenModel.model.tags),
    ).toBe(true)
    expect(browser.visits).toContain(toUrlString(tagFeed))
  })

  it('sends a signed-out switch to the user feed to login', () => {
    const { next, write } = step(
      homeScreenMsg({ _tag: 'ChangeTab', tab: userFeedTab() }),
      bootOn('/', false),
    )
    expect(destinationOf(next)).toEqual(loginDestination())
    expect(write).toEqual(
      O.some({ _tag: 'PushUrl', url: toUrlString(loginDestination()) }),
    )
  })

  it('follows a home page change with a push', () => {
    const { next, write } = step(
      homeScreenMsg({
        _tag: 'PaginationMsg',
        subMsg: { _tag: 'ChangePage', page: 2 },
      }),
      bootOn('/', true),
    )
    const pageTwo = destinationOfScreen(homeScreen(globalFeedTab(), 2))
    expect(destinationOf(next)).toEqual(pageTwo)
    expect(write).toEqual(
      O.some({ _tag: 'PushUrl', url: toUrlString(pageTwo) }),
    )
  })

  it('follows a profile favorites switch with a push', () => {
    const { next, write } = step(
      {
        _tag: 'ProfileScreenMsg',
        subMsg: { _tag: 'ToggleFavorites', show: true },
      },
      bootOn(toUrlString(profileDestination), true),
    )
    const favorites = destinationOfScreen(profileScreen('jake', true))
    expect(destinationOf(next)).toEqual(favorites)
    expect(write).toEqual(
      O.some({ _tag: 'PushUrl', url: toUrlString(favorites) }),
    )
  })

  it("opens the browser's back as a move, never writing over its entry", () => {
    const { next: onArticle } = step(
      navigate(articleDestination),
      bootOn('/', true),
    )
    const { next: back, write } = step(
      urlChanged(defaultDestination()),
      onArticle,
    )
    expect(destinationOf(back)).toEqual(defaultDestination())
    expect(write).toEqual(O.none)
  })

  it('goes back to the previous home page, keeping the screen', () => {
    const { next: pageTwo } = step(
      homeScreenMsg({
        _tag: 'PaginationMsg',
        subMsg: { _tag: 'ChangePage', page: 2 },
      }),
      bootOn('/', true),
    )
    const { next: back, write } = step(
      urlChanged(defaultDestination()),
      pageTwo,
    )
    expect(destinationOf(back)).toEqual(defaultDestination())
    expect(write).toEqual(O.none)
  })

  it('keeps the screen when back or forward lands on the destination shown', () => {
    const onArticle = bootOn(toUrlString(articleDestination), true)
    const { next, write } = step(urlChanged(articleDestination), onArticle)
    // Only the mobile menu closes, as on every move
    expect(next.screenModel).toBe(onArticle.screenModel)
    expect(write).toEqual(O.none)
  })

  it("corrects the browser's entry with a replace when the guard redirects its move", () => {
    const signedOut = bootOn('/login', false)
    const { next, write } = step(urlChanged(settingsDestination), signedOut)
    expect(destinationOf(next)).toEqual(loginDestination())
    expect(write).toEqual(
      O.some({ _tag: 'ReplaceUrl', url: toUrlString(loginDestination()) }),
    )
  })

  it('pushes home on a logout from the settings', () => {
    const { next, write } = step(
      { _tag: 'SettingsScreenMsg', subMsg: { _tag: 'Logout' } },
      bootOn(toUrlString(settingsDestination), true),
    )
    expect(destinationOf(next)).toEqual(defaultDestination())
    expect(next.shared.user).toEqual(O.none)
    expect(write).toEqual(
      O.some({ _tag: 'PushUrl', url: toUrlString(defaultDestination()) }),
    )
  })

  it('pushes home when the login succeeds', () => {
    const { next, write } = step(
      {
        _tag: 'LoginScreenMsg',
        subMsg: { _tag: 'SubmitResponse', result: new Ok({ user }) },
      },
      bootOn('/login', false),
    )
    expect(destinationOf(next)).toEqual(defaultDestination())
    expect(write).toEqual(
      O.some({ _tag: 'PushUrl', url: toUrlString(defaultDestination()) }),
    )
  })

  it("reads the browser's back and forward as UrlChanged", () => {
    expect(
      urlChangedMsg(locationOf('/?tab=tag-feed&tag=react&page=3')),
    ).toEqual(
      urlChanged(destinationOfScreen(homeScreen(tagFeedTab('react'), 3))),
    )
  })

  it("puts the URL write before the step's own Cmd", () => {
    const home: Model = bootOn('/', true)
    const msg = navigate(articleDestination)
    const [next] = update(msg, home)
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
    expect(order).toEqual([`push ${toUrlString(articleDestination)}`])
  })
})
