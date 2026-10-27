import * as O from 'fp-ts/lib/Option'
import { Cmd } from 'tea-cup-fp'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  ALL_COMPONENT_ITEMS,
  type Destination,
  ITEM_SCREENS,
  boxScreen,
  cardScreen,
  defaultDestination,
  destinationOfScreen,
  notFoundScreen,
  toUrlString,
} from '@/common/type/destination'
import { type Msg } from '@/type'
import { update } from '@/update'
import { destinationOf, urlChangedMsg, withUrl } from '@/util'

import {
  bootOn,
  locationOf,
  navigate,
  step,
  stubBrowser,
  urlChanged,
} from '../helper/app'

// The URL is an adapter at the edges: the destination is read from the
// models, the URL is written from it after each step and read only at boot
// and on the browser's back and forward.

// Every destination with a URL of its own (not found keeps the URL typed)
const destinations: Destination[] = [
  defaultDestination(),
  ...ALL_COMPONENT_ITEMS.map((item) => destinationOfScreen(ITEM_SCREENS[item])),
]

const boxDestination = destinationOfScreen(boxScreen())
const cardDestination = destinationOfScreen(cardScreen())

describe('URL adapter', () => {
  beforeEach(stubBrowser)
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('boots on the destination of every URL', () => {
    destinations.forEach((destination) => {
      expect(destinationOf(bootOn(toUrlString(destination)))).toEqual(
        destination,
      )
    })
    expect(destinationOf(bootOn('/no/such/page'))).toEqual(
      destinationOfScreen(notFoundScreen()),
    )
  })

  it('shows every destination after a Navigate from home', () => {
    const home = bootOn('/')
    destinations.forEach((destination) => {
      expect(destinationOf(step(navigate(destination), home).next)).toEqual(
        destination,
      )
    })
  })

  it('pushes an entry for a new destination', () => {
    expect(step(navigate(boxDestination), bootOn('/')).write).toEqual(
      O.some({ _tag: 'PushUrl', url: toUrlString(boxDestination) }),
    )
  })

  it('writes nothing when the destination stays', () => {
    const home = bootOn('/')
    expect(step({ _tag: 'NoOp' }, home).write).toEqual(O.none)
    expect(step({ _tag: 'ToggleThemeMenu' }, home).write).toEqual(O.none)
  })

  it('refreshes the screen shown on a click to it, with no new entry', () => {
    const onBox = bootOn('/box')
    const { next, write } = step(navigate(boxDestination), onBox)
    expect(next.screenModel).not.toBe(onBox.screenModel)
    expect(write).toEqual(O.none)
  })

  it('pushes the destination of a clicked sidebar item', () => {
    const { next, write } = step(
      {
        _tag: 'SidebarMsg',
        subMsg: {
          _tag: 'ClickItem',
          item: { key: 'card', label: 'Card', isActive: false },
        },
      },
      bootOn('/box'),
    )
    expect(destinationOf(next)).toEqual(cardDestination)
    expect(write).toEqual(
      O.some({ _tag: 'PushUrl', url: toUrlString(cardDestination) }),
    )
  })

  it("opens the browser's back as a move, never writing over its entry", () => {
    const { next: onCard } = step(navigate(cardDestination), bootOn('/box'))
    const { next: back, write } = step(urlChanged(boxDestination), onCard)
    expect(destinationOf(back)).toEqual(boxDestination)
    expect(write).toEqual(O.none)
  })

  it('keeps the screen when back or forward lands on the destination shown', () => {
    const onBox = bootOn('/box')
    const { next, write } = step(urlChanged(boxDestination), onBox)
    expect(next).toBe(onBox)
    expect(write).toEqual(O.none)
  })

  it('leaves another spelling of the destination shown as it is', () => {
    const onBox = bootOn('/box/')
    expect(destinationOf(onBox)).toEqual(boxDestination)
    expect(urlChangedMsg(locationOf('/box/'))).toEqual(
      urlChanged(boxDestination),
    )
  })

  it("puts the URL write before the step's own Cmd", () => {
    const home = bootOn('/')
    const msg = navigate(boxDestination)
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
    expect(order).toEqual([`push ${toUrlString(boxDestination)}`])
  })
})
