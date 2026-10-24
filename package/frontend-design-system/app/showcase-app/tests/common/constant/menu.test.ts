import { describe, expect, it } from 'vitest'

import { SHOWCASE_CATEGORIES, activeComponentOf } from '@/common/constant/menu'
import { pageHome, pageNotFound, parsePath } from '@/common/type/route'

describe('activeComponentOf', () => {
  // Every menu item must light up on its own page, hyphenated ids included
  it('gives the id of the menu item whose page is open', () => {
    SHOWCASE_CATEGORIES.flatMap((cat) => cat.items).forEach((item) => {
      expect(activeComponentOf(parsePath(`/${item.id}`))).toBe(item.id)
    })
  })

  it('gives no item for home and the not-found page', () => {
    expect(activeComponentOf({ page: pageHome() })).toBe('')
    expect(activeComponentOf({ page: pageNotFound() })).toBe('')
  })
})
