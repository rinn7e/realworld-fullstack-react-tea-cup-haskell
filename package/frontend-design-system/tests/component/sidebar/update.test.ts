import { describe, expect, it } from 'vitest'

import { init, update } from '../../../lib/component/sidebar/update'
import type { NavItemData } from '../../../lib/type/nav-item'

const leaf: NavItemData = { key: 'leaf', label: 'Leaf', isActive: false }
const parent: NavItemData = {
  key: 'parent',
  label: 'Parent',
  isActive: false,
  children: [leaf],
}

describe('sidebar update', () => {
  const [model] = init(false)

  it('toggles a parent item open and closed on ClickItem', () => {
    const [opened] = update({ _tag: 'ClickItem', item: parent })(model)
    expect(opened.expandedKeys).toEqual(['parent'])
    const [closed] = update({ _tag: 'ClickItem', item: parent })(opened)
    expect(closed.expandedKeys).toEqual([])
  })

  it('leaves the model untouched when a leaf item is clicked', () => {
    const [next] = update({ _tag: 'ClickItem', item: leaf })(model)
    expect(next).toEqual(model)
  })
})
