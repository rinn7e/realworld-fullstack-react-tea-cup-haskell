import * as O from 'fp-ts/lib/Option'
import { describe, expect, it } from 'vitest'

import {
  getSidebarCategories,
  navItemDestination,
  navItemHref,
} from '@/common/constant/menu'
import {
  ALL_COMPONENT_ITEMS,
  ITEM_SCREENS,
  blockScreen,
  defaultDestination,
  destinationOfScreen,
  homeScreen,
  itemOfScreen,
  notFoundScreen,
  toUrlString,
} from '@/common/type/destination'

describe('menu', () => {
  it('links every sidebar item to the URL of its screen', () => {
    getSidebarCategories('')
      .flatMap((category) => category.items)
      .forEach((item) => {
        expect(item.href).toBe(
          O.toUndefined(O.map(toUrlString)(navItemDestination(item.key))),
        )
      })
  })

  it('opens the screen of each component item, and reads it back', () => {
    ALL_COMPONENT_ITEMS.forEach((item) => {
      expect(navItemDestination(item)).toEqual(
        O.some(destinationOfScreen(ITEM_SCREENS[item])),
      )
      expect(itemOfScreen(ITEM_SCREENS[item])).toEqual(O.some(item))
    })
  })

  it('opens the navbar entries', () => {
    expect(navItemDestination('home')).toEqual(O.some(defaultDestination()))
    expect(navItemDestination('elements')).toEqual(
      O.some(destinationOfScreen(blockScreen())),
    )
    expect(navItemHref('form')).toBe('/field')
  })

  it('opens nothing for the external apps', () => {
    expect(navItemDestination('frontend-web')).toEqual(O.none)
  })

  it('highlights no item on home and not found', () => {
    expect(itemOfScreen(homeScreen())).toEqual(O.none)
    expect(itemOfScreen(notFoundScreen())).toEqual(O.none)
  })
})
