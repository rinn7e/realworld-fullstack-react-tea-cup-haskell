import * as RD from '@devexperts/remote-data-ts'
import type * as Pagination from '@rinn7e/tea-cup-pagination'
import { ArrayExtra } from '@rinn7e/tea-cup-prelude'
import * as A from 'fp-ts/lib/Array'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import { Cmd } from 'tea-cup-fp'

/**
 * Runs a child `update` on the loaded pagination item matching `item`
 * (via `isSameItem`) and re-wraps its command as a pagination `ItemMsg`.
 * Leaves the pagination untouched when the items are not loaded or no item matches.
 */
export const updatePaginationItem =
  <Item, ItemMsg>(
    isSameItem: (a: Item, b: Item) => boolean,
    updateItem: (msg: ItemMsg, item: Item) => [Item, Cmd<ItemMsg>],
  ) =>
  <Err>(
    item: Item,
    msg: ItemMsg,
    pagination: Pagination.Model<Item, Err>,
  ): [Pagination.Model<Item, Err>, Cmd<Pagination.Msg<Item, ItemMsg, Err>>] => {
    if (pagination.items._tag === 'RemoteSuccess') {
      const items = pagination.items.value
      return pipe(
        items,
        A.findIndex((a) => isSameItem(a, item)),
        O.fold(
          (): [
            Pagination.Model<Item, Err>,
            Cmd<Pagination.Msg<Item, ItemMsg, Err>>,
          ] => [pagination, Cmd.none()],
          (index) => {
            const [updated, subCmd] = updateItem(msg, items[index])
            return [
              {
                ...pagination,
                items: RD.success(
                  pipe(
                    items,
                    ArrayExtra.modifyAtIfExist(index, () => updated),
                  ),
                ),
              },
              subCmd.map((sm): Pagination.Msg<Item, ItemMsg, Err> => ({
                _tag: 'ItemMsg',
                item: updated,
                msg: sm,
              })),
            ]
          },
        ),
      )
    } else {
      return [pagination, Cmd.none()]
    }
  }
