import { ok } from 'tea-cup-fp'
import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  pageArticles,
  pageHome,
  pageLogin,
  pageSettings,
  pageUsers,
} from '@/common/type/route'
import { pageModelToRoute } from '@/type'
import {
  guardRoute,
  init,
  navigateHandler,
  update,
  urlChangedHandler,
} from '@/update'

import { runCmd, stubBrowser } from './helper/browser'
import {
  allRoutes,
  loggedIn,
  loggedOut,
  modelAt,
  tokenOnly,
} from './helper/fixture'

afterEach(() => vi.unstubAllGlobals())

const urlOf = (path: string) => new URL(`http://localhost${path}`)

describe('guardRoute', () => {
  it('sends a logged-out visitor to login', () => {
    expect(guardRoute({ page: pageUsers() }, loggedOut)).toEqual({
      page: pageLogin(),
    })
    expect(guardRoute({ page: pageLogin() }, loggedOut)).toEqual({
      page: pageLogin(),
    })
  })

  // The server was unreachable at boot, so the saved token is trusted
  it('lets a kept token through', () => {
    expect(guardRoute({ page: pageUsers() }, tokenOnly)).toEqual({
      page: pageUsers(),
    })
  })

  it('sends a logged-in user away from login', () => {
    expect(guardRoute({ page: pageLogin() }, loggedIn)).toEqual({
      page: pageHome(),
    })
    expect(guardRoute({ page: pageUsers() }, loggedIn)).toEqual({
      page: pageUsers(),
    })
  })

  // The guard runs once, so its result must already pass the guard
  it('is stable when guarded again', () => {
    ;[loggedOut, tokenOnly, loggedIn].forEach((shared) => {
      allRoutes.forEach((route) => {
        const once = guardRoute(route, shared)
        expect(guardRoute(once, shared)).toEqual(once)
      })
    })
  })
})

describe('init', () => {
  // A guard redirect at boot must leave no history entry to bounce off
  it('replaces the URL when the guard redirects', async () => {
    const writes = stubBrowser('/articles')
    const [model, cmd] = init(
      window.location,
      loggedOut.user,
      false,
      loggedOut.token,
    )
    await runCmd(cmd)
    expect(pageModelToRoute(model.pageModel)).toEqual({ page: pageLogin() })
    expect(writes).toEqual([['replace', '/login']])
  })
})

describe('navigateHandler', () => {
  it('opens the guarded route and pushes its URL', async () => {
    const writes = stubBrowser('/login')
    const [next, cmd] = navigateHandler(
      { page: pageArticles() },
      modelAt({ page: pageLogin() }, loggedIn),
    )
    await runCmd(cmd)
    expect(pageModelToRoute(next.pageModel)).toEqual({ page: pageArticles() })
    expect(writes).toEqual([['push', '/articles']])
  })

  it('sends a logged-out visitor to login without a new entry', async () => {
    const writes = stubBrowser('/login')
    const [next, cmd] = navigateHandler(
      { page: pageArticles() },
      modelAt({ page: pageLogin() }, loggedOut),
    )
    await runCmd(cmd)
    expect(pageModelToRoute(next.pageModel)).toEqual({ page: pageLogin() })
    expect(writes).toEqual([])
  })

  // Clicking the active sidebar link refreshes the page
  it('reinitializes the page already open without a new entry', async () => {
    const writes = stubBrowser('/users')
    const model = modelAt({ page: pageUsers() })
    const [next, cmd] = navigateHandler({ page: pageUsers() }, model)
    await runCmd(cmd)
    expect(next.pageModel).not.toBe(model.pageModel)
    expect(pageModelToRoute(next.pageModel)).toEqual({ page: pageUsers() })
    expect(writes).toEqual([])
  })
})

describe('urlChangedHandler', () => {
  // The browser has already moved to the URL, so nothing needs writing
  it('opens the page of the new URL', async () => {
    const writes = stubBrowser('/articles')
    const [next, cmd] = urlChangedHandler(
      urlOf('/articles'),
      modelAt({ page: pageUsers() }),
    )
    await runCmd(cmd)
    expect(pageModelToRoute(next.pageModel)).toEqual({ page: pageArticles() })
    expect(writes).toEqual([])
  })

  it('keeps the page when back / forward lands on the page already shown', async () => {
    const writes = stubBrowser('/users')
    const model = modelAt({ page: pageUsers() })
    const [next, cmd] = urlChangedHandler(urlOf('/users'), model)
    await runCmd(cmd)
    expect(next.pageModel).toBe(model.pageModel)
    expect(writes).toEqual([])
  })

  // Back to `/settings` after logout keeps the login page, and the URL must
  // say so
  it('replaces the URL when the guard redirects to the page already shown', async () => {
    const writes = stubBrowser('/settings')
    const model = modelAt({ page: pageLogin() }, loggedOut)
    const [next, cmd] = urlChangedHandler(urlOf('/settings'), model)
    await runCmd(cmd)
    expect(next.pageModel).toBe(model.pageModel)
    expect(writes).toEqual([['replace', '/login']])
  })

  // A push here would cut off the forward history
  it('replaces, never pushes, when the guard redirects to another page', async () => {
    const writes = stubBrowser('/login')
    const [next, cmd] = urlChangedHandler(
      urlOf('/login'),
      modelAt({ page: pageUsers() }, loggedIn),
    )
    await runCmd(cmd)
    expect(pageModelToRoute(next.pageModel)).toEqual({ page: pageHome() })
    expect(writes).toEqual([['replace', '/']])
  })
})

describe('update', () => {
  // Logout goes through `navigateHandler`, so it gets the URL write with it
  it('opens login and pushes its URL on logout', async () => {
    const writes = stubBrowser('/settings')
    const [next, cmd] = update(
      { _tag: 'Logout' },
      modelAt({ page: pageSettings() }),
    )
    await runCmd(cmd)
    expect(pageModelToRoute(next.pageModel)).toEqual({ page: pageLogin() })
    expect(writes).toEqual([['push', '/login']])
  })

  // Login success goes through `navigateHandler`, so it gets the URL write
  it('opens home and pushes its URL on login success', async () => {
    const writes = stubBrowser('/login')
    const user = {
      email: 'admin@example.com',
      token: 'token',
      username: 'admin',
      bio: null,
      image: null,
    }
    const [next, cmd] = update(
      {
        _tag: 'LoginPageMsg',
        subMsg: { _tag: 'SubmitResult', result: ok({ user }) },
      },
      modelAt({ page: pageLogin() }, loggedOut),
    )
    await runCmd(cmd)
    expect(pageModelToRoute(next.pageModel)).toEqual({ page: pageHome() })
    expect(writes).toEqual([['push', '/']])
  })

  // A command answering `NoOp` must not lead to another command
  it('does nothing on NoOp', async () => {
    const writes = stubBrowser('/users')
    const [, cmd] = update({ _tag: 'NoOp' }, modelAt({ page: pageUsers() }))
    expect(await runCmd(cmd)).toEqual([])
    expect(writes).toEqual([])
  })
})
