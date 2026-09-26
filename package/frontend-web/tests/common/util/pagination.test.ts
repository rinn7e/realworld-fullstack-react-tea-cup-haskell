import * as RD from '@devexperts/remote-data-ts'
import type * as Pagination from '@rinn7e/tea-cup-pagination'
import { Cmd } from 'tea-cup-fp'
import { describe, expect, it } from 'vitest'

import { updatePaginationItem } from '@/common/util'

type Item = { id: string; count: number }
type ItemMsg = { _tag: 'Increment' }

const increment = updatePaginationItem(
  (a: Item, b: Item) => a.id === b.id,
  (_msg: ItemMsg, item: Item): [Item, Cmd<ItemMsg>] => [
    { ...item, count: item.count + 1 },
    Cmd.none(),
  ],
)

const mkPagination = (
  items: RD.RemoteData<string, Item[]>,
): Pagination.Model<Item, string> => ({ items, page: 1, pageAmount: 1 })

describe('updatePaginationItem', () => {
  it('updates only the matching loaded item', () => {
    const pagination = mkPagination(
      RD.success([
        { id: 'a', count: 0 },
        { id: 'b', count: 5 },
      ]),
    )
    const [updated] = increment(
      { id: 'b', count: 5 },
      { _tag: 'Increment' },
      pagination,
    )
    expect(updated.items).toEqual(
      RD.success([
        { id: 'a', count: 0 },
        { id: 'b', count: 6 },
      ]),
    )
  })

  it('leaves the pagination unchanged when no item matches', () => {
    const pagination = mkPagination(RD.success([{ id: 'a', count: 0 }]))
    const [updated] = increment(
      { id: 'z', count: 0 },
      { _tag: 'Increment' },
      pagination,
    )
    expect(updated).toBe(pagination)
  })

  it('leaves the pagination unchanged while items are not loaded', () => {
    const pagination = mkPagination(RD.pending)
    const [updated] = increment(
      { id: 'a', count: 0 },
      { _tag: 'Increment' },
      pagination,
    )
    expect(updated).toBe(pagination)
  })
})
