import { describe, expect, it } from 'vitest'

import { init, update } from '../../../lib/component/floating-sidebar/update'
import type { NavItemData } from '../../../lib/type/nav-item'

const leaf: NavItemData = { key: 'leaf', label: 'Leaf', isActive: false }
const parent: NavItemData = {
  key: 'parent',
  label: 'Parent',
  isActive: false,
  children: [leaf],
}

describe('floating-sidebar update', () => {
  const [closedModel] = init()
  const [model] = update({ _tag: 'Toggle', open: true })(closedModel)

  it('expands a parent item and keeps the sidebar open', () => {
    const [next] = update({ _tag: 'ClickItem', item: parent })(model)
    expect(next.expandedKeys).toEqual(['parent'])
    expect(next.status.state._tag).toBe('AnimateIn')
  })

  it('starts closing the sidebar when a leaf item is clicked', () => {
    const [next] = update({ _tag: 'ClickItem', item: leaf })(model)
    expect(next.status.state._tag).toBe('AnimateOut')
  })

  it('keeps the sidebar open for a leaf with shouldCloseOnSelect false', () => {
    const [next] = update({
      _tag: 'ClickItem',
      item: { ...leaf, shouldCloseOnSelect: false },
    })(model)
    expect(next.status.state._tag).toBe('AnimateIn')
  })
})
