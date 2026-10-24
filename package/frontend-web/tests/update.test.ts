import * as DsFloatingSidebar from '@rinn7e/realworld-design-system/component/floating-sidebar'
import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  globalFeedTab,
  pageArticle,
  pageHome,
  pageLogin,
  pageProfile,
  pageSettings,
  tagFeedTab,
  userFeedTab,
} from '@/common/type/route'
import { type Model, type Msg, pageModelToRoute } from '@/type'
import {
  guardRoute,
  init,
  navigateHandler,
  update,
  urlChangedHandler,
} from '@/update'

import { runCmd, stubBrowser } from './helper/browser'
import { loggedIn, loggedOut, modelAt } from './helper/fixture'
import { allRoutes } from './helper/route'

afterEach(() => vi.unstubAllGlobals())

const urlOf = (path: string) => new URL(`http://localhost${path}`)

const closedSidebar = DsFloatingSidebar.init()[0]

const withOpenSidebar = (model: Model): Model => ({
  ...model,
  sidebar: DsFloatingSidebar.update({ _tag: 'Toggle', open: true })(
    model.sidebar,
  )[0],
})

describe('guardRoute', () => {
  it('sends a visitor to login for pages that need a user', () => {
    ;[
      pageSettings(),
      pageHome(userFeedTab(), 1),
      { _tag: 'PageEditor' as const, slug: { _tag: 'None' as const } },
    ].forEach((page) => {
      expect(guardRoute({ page }, loggedOut)).toEqual({ page: pageLogin() })
    })
  })

  it('sends a logged-in user away from login and signup', () => {
    expect(guardRoute({ page: pageLogin() }, loggedIn)).toEqual({
      page: pageHome(),
    })
  })

  // The guard runs once, so its result must already pass the guard
  it('is stable when guarded again', () => {
    ;[loggedOut, loggedIn].forEach((shared) => {
      allRoutes.forEach((route) => {
        const once = guardRoute(route, shared)
        expect(guardRoute(once, shared)).toEqual(once)
      })
    })
  })
})

describe('init', () => {
  // `Init` arrives on a timer after the page load event; a token saved in
  // between (e.g. by a test, before a reload) must survive the boot
  it('leaves a stored token alone when booting without one', () => {
    stubBrowser('/')
    const removeItem = vi.fn()
    vi.stubGlobal('localStorage', {
      getItem: () => 'token-saved-after-load',
      setItem: () => undefined,
      removeItem,
    })
    init(window.location, loggedOut.user, false, loggedOut.token)
    expect(removeItem).not.toHaveBeenCalled()
  })

  // A guard redirect at boot must leave no history entry to bounce off
  it('replaces the URL when the guard redirects, and tracks the visit', async () => {
    const browser = stubBrowser('/settings')
    const [model, cmd] = init(
      window.location,
      loggedOut.user,
      false,
      loggedOut.token,
    )
    await runCmd(cmd)
    expect(pageModelToRoute(model.pageModel)).toEqual({ page: pageLogin() })
    expect(browser.writes).toEqual([['replace', '/login']])
    expect(browser.visits).toEqual(['/login'])
  })

  it('keeps the home query params', async () => {
    const browser = stubBrowser('/?tab=tag-feed&tag=react&page=2')
    const [model, cmd] = init(
      window.location,
      loggedIn.user,
      false,
      loggedIn.token,
    )
    await runCmd(cmd)
    expect(pageModelToRoute(model.pageModel)).toEqual({
      page: pageHome(tagFeedTab('react'), 2),
    })
    expect(browser.writes).toEqual([])
  })
})

describe('navigateHandler', () => {
  it('opens the route, pushes its URL, closes the sidebar and tracks the visit', async () => {
    const browser = stubBrowser('/')
    const [next, cmd] = navigateHandler(
      { page: pageArticle('my-post') },
      withOpenSidebar(modelAt({ page: pageHome() })),
    )
    await runCmd(cmd)
    expect(pageModelToRoute(next.pageModel)).toEqual({
      page: pageArticle('my-post'),
    })
    expect(next.sidebar).toEqual(closedSidebar)
    expect(browser.writes).toEqual([['push', '/article/my-post']])
    expect(browser.visits).toEqual(['/article/my-post'])
  })

  // Clicking the active link refreshes the page and closes the sidebar
  it('reinitializes the page already open without a new entry or a visit', async () => {
    const browser = stubBrowser('/article/my-post')
    const model = withOpenSidebar(modelAt({ page: pageArticle('my-post') }))
    const [next, cmd] = navigateHandler({ page: pageArticle('my-post') }, model)
    await runCmd(cmd)
    expect(next.pageModel).not.toBe(model.pageModel)
    expect(next.sidebar).toEqual(closedSidebar)
    expect(browser.writes).toEqual([])
    expect(browser.visits).toEqual([])
  })

  it('sends a visitor to login', async () => {
    const browser = stubBrowser('/')
    const [next, cmd] = navigateHandler(
      { page: pageSettings() },
      modelAt({ page: pageHome() }, loggedOut),
    )
    await runCmd(cmd)
    expect(pageModelToRoute(next.pageModel)).toEqual({ page: pageLogin() })
    expect(browser.writes).toEqual([['push', '/login']])
  })
})

describe('urlChangedHandler', () => {
  // The browser has already moved to the URL, so nothing needs writing
  it('opens the page of the new URL, closes the sidebar and tracks the visit', async () => {
    const browser = stubBrowser('/profile/jake')
    const [next, cmd] = urlChangedHandler(
      urlOf('/profile/jake'),
      withOpenSidebar(modelAt({ page: pageHome() })),
    )
    await runCmd(cmd)
    expect(pageModelToRoute(next.pageModel)).toEqual({
      page: pageProfile('jake', false),
    })
    expect(next.sidebar).toEqual(closedSidebar)
    expect(browser.writes).toEqual([])
    expect(browser.visits).toEqual(['/profile/jake'])
  })

  // Keep what the user typed instead of rewriting it to `/404`
  it('never writes the not-found page', async () => {
    const browser = stubBrowser('/no/such/page')
    const [next, cmd] = urlChangedHandler(
      urlOf('/no/such/page'),
      modelAt({ page: pageHome() }),
    )
    await runCmd(cmd)
    expect(next.pageModel._tag).toBe('NotFoundPageModel')
    expect(browser.writes).toEqual([])
  })

  it('keeps the page already shown but closes the sidebar', async () => {
    const browser = stubBrowser('/article/my-post')
    const model = withOpenSidebar(modelAt({ page: pageArticle('my-post') }))
    const [next, cmd] = urlChangedHandler(urlOf('/article/my-post'), model)
    await runCmd(cmd)
    expect(next.pageModel).toBe(model.pageModel)
    expect(next.sidebar).toEqual(closedSidebar)
    expect(browser.writes).toEqual([])
    expect(browser.visits).toEqual([])
  })

  // Back to `/settings` after logout keeps the login page, and the URL must
  // say so
  it('replaces the URL when the guard redirects to the page already shown', async () => {
    const browser = stubBrowser('/settings')
    const model = modelAt({ page: pageLogin() }, loggedOut)
    const [next, cmd] = urlChangedHandler(urlOf('/settings'), model)
    await runCmd(cmd)
    expect(next.pageModel).toBe(model.pageModel)
    expect(browser.writes).toEqual([['replace', '/login']])
  })

  // A push here would cut off the forward history
  it('replaces, never pushes, when the guard redirects to another page', async () => {
    const browser = stubBrowser('/login')
    const [next, cmd] = urlChangedHandler(
      urlOf('/login'),
      modelAt({ page: pageArticle('my-post') }),
    )
    await runCmd(cmd)
    expect(pageModelToRoute(next.pageModel)).toEqual({ page: pageHome() })
    expect(browser.writes).toEqual([['replace', '/']])
  })
})

describe('update: a page changes its own route params', () => {
  it('pushes the home tab without reloading the page', async () => {
    const browser = stubBrowser('/')
    const msg: Msg = {
      _tag: 'HomePageMsg',
      subMsg: { _tag: 'ChangeTab', tab: tagFeedTab('react') },
    }
    const [next, cmd] = update(
      msg,
      withOpenSidebar(modelAt({ page: pageHome() })),
    )
    await runCmd(cmd)
    expect(pageModelToRoute(next.pageModel)).toEqual({
      page: pageHome(tagFeedTab('react'), 1),
    })
    expect(next.sidebar).toEqual(closedSidebar)
    expect(browser.writes).toEqual([['push', '/?tab=tag-feed&tag=react']])
    expect(browser.visits).toEqual(['/?tab=tag-feed&tag=react'])
  })

  it('pushes the home page number', async () => {
    const browser = stubBrowser('/')
    const msg: Msg = {
      _tag: 'HomePageMsg',
      subMsg: {
        _tag: 'PaginationMsg',
        subMsg: { _tag: 'ChangePage', page: 3 },
      },
    }
    const [next, cmd] = update(msg, modelAt({ page: pageHome() }))
    await runCmd(cmd)
    expect(pageModelToRoute(next.pageModel)).toEqual({
      page: pageHome(globalFeedTab(), 3),
    })
    expect(browser.writes).toEqual([['push', '/?page=3']])
  })

  it('sends a visitor who picks the user feed to login', async () => {
    const browser = stubBrowser('/')
    const msg: Msg = {
      _tag: 'HomePageMsg',
      subMsg: { _tag: 'ChangeTab', tab: userFeedTab() },
    }
    const [next, cmd] = update(msg, modelAt({ page: pageHome() }, loggedOut))
    await runCmd(cmd)
    expect(pageModelToRoute(next.pageModel)).toEqual({ page: pageLogin() })
    expect(browser.writes).toEqual([['push', '/login']])
  })

  it('pushes the profile favorites toggle', async () => {
    const browser = stubBrowser('/profile/jake')
    const msg: Msg = {
      _tag: 'ProfilePageMsg',
      subMsg: { _tag: 'ToggleFavorites', show: true },
    }
    const [next, cmd] = update(
      msg,
      modelAt({ page: pageProfile('jake', false) }),
    )
    await runCmd(cmd)
    expect(pageModelToRoute(next.pageModel)).toEqual({
      page: pageProfile('jake', true),
    })
    expect(browser.writes).toEqual([['push', '/profile/jake?favorites=true']])
  })

  // Picking the tab already shown changes nothing
  it('writes nothing when the route params did not change', async () => {
    const browser = stubBrowser('/')
    const msg: Msg = {
      _tag: 'HomePageMsg',
      subMsg: { _tag: 'ChangeTab', tab: globalFeedTab() },
    }
    const [, cmd] = update(msg, modelAt({ page: pageHome() }))
    await runCmd(cmd)
    expect(browser.writes).toEqual([])
    expect(browser.visits).toEqual([])
  })
})

describe('update', () => {
  // Logout goes through `navigateHandler`, so it gets the URL write with it
  it('opens home and pushes its URL on logout from settings', async () => {
    const browser = stubBrowser('/settings')
    const msg: Msg = { _tag: 'SettingsPageMsg', subMsg: { _tag: 'Logout' } }
    const [next, cmd] = update(msg, modelAt({ page: pageSettings() }))
    await runCmd(cmd)
    expect(pageModelToRoute(next.pageModel)).toEqual({ page: pageHome() })
    expect(browser.writes).toEqual([['push', '/']])
  })

  // A command answering `NoOp` must not lead to another command
  it('does nothing on NoOp', async () => {
    const browser = stubBrowser('/')
    const [, cmd] = update({ _tag: 'NoOp' }, modelAt({ page: pageHome() }))
    expect(await runCmd(cmd)).toEqual([])
    expect(browser.writes).toEqual([])
  })
})
