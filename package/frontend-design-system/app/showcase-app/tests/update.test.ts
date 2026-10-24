import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  pageBox,
  pageButton,
  pageHome,
  pageNotFound,
} from '@/common/type/route'
import { pageModelToRoute } from '@/type'
import { init, navigateHandler, update, urlChangedHandler } from '@/update'

import { runCmd, stubBrowser } from './helper/browser'
import { modelAt } from './helper/fixture'

afterEach(() => vi.unstubAllGlobals())

const urlOf = (path: string) => new URL(`http://localhost${path}`)

const navItem = (href: string) => ({
  key: href,
  label: href,
  href,
  isActive: false,
})

describe('init', () => {
  it('opens the page of the URL and leaves the URL alone', async () => {
    const writes = stubBrowser('/box')
    const [model, cmd] = init(window.location)
    await runCmd(cmd)
    expect(pageModelToRoute(model.pageModel)).toEqual({ page: pageBox() })
    expect(writes).toEqual([])
  })

  // Tidying the typed URL must leave no extra history entry
  it('replaces a URL spelled differently from the route', async () => {
    const writes = stubBrowser('/box/')
    const [model, cmd] = init(window.location)
    await runCmd(cmd)
    expect(pageModelToRoute(model.pageModel)).toEqual({ page: pageBox() })
    expect(writes).toEqual([['replace', '/box']])
  })

  it('keeps an unknown URL as typed', async () => {
    const writes = stubBrowser('/no/such/page')
    const [model, cmd] = init(window.location)
    await runCmd(cmd)
    expect(pageModelToRoute(model.pageModel)).toEqual({ page: pageNotFound() })
    expect(writes).toEqual([])
  })
})

describe('navigateHandler', () => {
  it('opens the route and pushes its URL', async () => {
    const writes = stubBrowser('/')
    const [next, cmd] = navigateHandler(
      { page: pageBox() },
      modelAt({ page: pageHome() }),
    )
    await runCmd(cmd)
    expect(pageModelToRoute(next.pageModel)).toEqual({ page: pageBox() })
    expect(writes).toEqual([['push', '/box']])
  })

  // Clicking the active sidebar link starts the page afresh
  it('reinitializes the page already open without a new entry', async () => {
    const writes = stubBrowser('/box')
    const model = modelAt({ page: pageBox() })
    const [next, cmd] = navigateHandler({ page: pageBox() }, model)
    await runCmd(cmd)
    expect(next.pageModel).not.toBe(model.pageModel)
    expect(pageModelToRoute(next.pageModel)).toEqual({ page: pageBox() })
    expect(writes).toEqual([])
  })
})

describe('urlChangedHandler', () => {
  // The browser has already moved to the URL, so nothing needs writing
  it('opens the page of the new URL', async () => {
    const writes = stubBrowser('/button')
    const [next, cmd] = urlChangedHandler(
      urlOf('/button'),
      modelAt({ page: pageBox() }),
    )
    await runCmd(cmd)
    expect(pageModelToRoute(next.pageModel)).toEqual({ page: pageButton() })
    expect(writes).toEqual([])
  })

  it('keeps the page when back / forward lands on the page already shown', async () => {
    const writes = stubBrowser('/box')
    const model = modelAt({ page: pageBox() })
    const [next, cmd] = urlChangedHandler(urlOf('/box'), model)
    await runCmd(cmd)
    expect(next.pageModel).toBe(model.pageModel)
    expect(writes).toEqual([])
  })

  // A push here would cut off the forward history
  it('replaces, never pushes, a URL spelled differently', async () => {
    const writes = stubBrowser('/box/')
    const model = modelAt({ page: pageBox() })
    const [next, cmd] = urlChangedHandler(urlOf('/box/'), model)
    await runCmd(cmd)
    expect(next.pageModel).toBe(model.pageModel)
    expect(writes).toEqual([['replace', '/box']])
  })
})

describe('update', () => {
  it('opens the clicked sidebar item and pushes its URL', async () => {
    const writes = stubBrowser('/')
    const [next, cmd] = update(
      {
        _tag: 'SidebarMsg',
        subMsg: { _tag: 'ClickItem', item: navItem('/button') },
      },
      modelAt({ page: pageHome() }),
    )
    await runCmd(cmd)
    expect(pageModelToRoute(next.pageModel)).toEqual({ page: pageButton() })
    expect(writes).toEqual([['push', '/button']])
  })

  it('opens the clicked navbar item and pushes its URL', async () => {
    const writes = stubBrowser('/box')
    const [next, cmd] = update(
      {
        _tag: 'TopNavbarMsg',
        subMsg: { _tag: 'ClickNavItem', item: navItem('/') },
      },
      modelAt({ page: pageBox() }),
    )
    await runCmd(cmd)
    expect(pageModelToRoute(next.pageModel)).toEqual({ page: pageHome() })
    expect(writes).toEqual([['push', '/']])
  })

  it('opens the route of Navigate and pushes its URL', async () => {
    const writes = stubBrowser('/no/such/page')
    const [next, cmd] = update(
      { _tag: 'Navigate', route: { page: pageHome() } },
      modelAt({ page: pageNotFound() }),
    )
    await runCmd(cmd)
    expect(pageModelToRoute(next.pageModel)).toEqual({ page: pageHome() })
    expect(writes).toEqual([['push', '/']])
  })

  it('opens the page of UrlChanged without writing', async () => {
    const writes = stubBrowser('/button')
    const [next, cmd] = update(
      { _tag: 'UrlChanged', url: urlOf('/button') },
      modelAt({ page: pageBox() }),
    )
    await runCmd(cmd)
    expect(pageModelToRoute(next.pageModel)).toEqual({ page: pageButton() })
    expect(writes).toEqual([])
  })

  // A command answering `NoOp` must not lead to another command
  it('does nothing on NoOp', async () => {
    const writes = stubBrowser('/box')
    const [, cmd] = update({ _tag: 'NoOp' }, modelAt({ page: pageBox() }))
    expect(await runCmd(cmd)).toEqual([])
    expect(writes).toEqual([])
  })
})
