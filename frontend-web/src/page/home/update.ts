import * as RD from '@devexperts/remote-data-ts'
import { ArrayExtra, attemptTE, updateAndCmd } from '@rinn7e/tea-cup-prelude'
import * as A from 'fp-ts/lib/Array'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import { Cmd } from 'tea-cup-fp'

import { getTags } from '@/common/api'
import type { Article } from '@/common/api/type/article'
import { type HomeTab, HomeTabEq } from '@/common/type/route'
import type { Shared } from '@/common/type/shared'
import * as ArticleShort from '@/component/article-short'
import * as Pagination from '@rinn7e/tea-cup-pagination'

import { mkPaginationConfig } from './helper'
import { type Model, type Msg } from './type'

export const init = (
  tab: HomeTab,
  page: number,
  shared: Shared,
): [Model, Cmd<Msg>] => {
  const paginationConfig = mkPaginationConfig(shared, tab)
  const [pagination, paginationCmd] = Pagination.init(paginationConfig, page)

  const model: Model = {
    pagination,
    tags: RD.pending,
    tab,
  }

  return [
    model,
    Cmd.batch([
      paginationCmd.map((m): Msg => ({ _tag: 'PaginationMsg', subMsg: m })),

      attemptTE(
        getTags(shared.token),
        (result): Msg => ({ _tag: 'GetTagsResponse', result }),
      ),
    ]),
  ]
}

export const update =
  (shared: Shared) =>
  (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
    switch (msg._tag) {
      case 'GetTagsResponse':
        if (msg.result.tag === 'Ok') {
          return [{ ...model, tags: RD.success(msg.result.value) }, Cmd.none()]
        } else {
          return [{ ...model, tags: RD.failure(msg.result.err) }, Cmd.none()]
        }
      case 'PaginationMsg': {
        const paginationConfig = mkPaginationConfig(shared, model.tab)
        const [pagination, paginationCmd] = Pagination.update(paginationConfig)(
          msg.subMsg,
          model.pagination,
        )

        return pipe(
          [
            { ...model, pagination },
            paginationCmd.map(
              (m): Msg => ({ _tag: 'PaginationMsg', subMsg: m }),
            ),
          ] as [Model, Cmd<Msg>],
          updateAndCmd((m) => {
            if (msg.subMsg._tag === 'ItemMsg')
              return paginationItemMsgHandler(
                shared,
                msg.subMsg.item,
                msg.subMsg.msg,
              )(m)
            else return [m, Cmd.none()]
          }),
        )
      }
      case 'ChangeTab': {
        if (HomeTabEq.equals(msg.tab, model.tab)) {
          return [model, Cmd.none()]
        } else {
          const paginationConfig = mkPaginationConfig(shared, msg.tab)
          const [pagination, paginationCmd] = Pagination.init(
            paginationConfig,
            1,
          )
          const newModel: Model = {
            ...model,
            tab: msg.tab,
            pagination,
          }

          return [
            newModel,
            paginationCmd.map(
              (m): Msg => ({ _tag: 'PaginationMsg', subMsg: m }),
            ),
          ]
        }
      }
      case 'NoOp':
        return [model, Cmd.none()]
    }
  }

const paginationItemMsgHandler =
  (shared: Shared, item: Article, msg: ArticleShort.Msg) =>
  (m: Model): [Model, Cmd<Msg>] => {
    if (m.pagination.items._tag === 'RemoteSuccess') {
      const articles = m.pagination.items.value
      return pipe(
        articles,
        A.findIndex((a) => a.slug === item.slug),
        O.fold(
          () => [m, Cmd.none()],
          (index) => {
            const [updated, subCmd] = ArticleShort.update(shared)(
              msg,
              articles[index],
            )
            return [
              {
                ...m,
                pagination: {
                  ...m.pagination,
                  items: RD.success(
                    pipe(
                      articles,
                      ArrayExtra.modifyAtIfExist(index, () => updated),
                    ),
                  ),
                },
              },
              subCmd.map(
                (sm): Msg => ({
                  _tag: 'PaginationMsg',
                  subMsg: {
                    _tag: 'ItemMsg',
                    item: updated,
                    msg: sm,
                  },
                }),
              ),
            ]
          },
        ),
      )
    } else {
      return [m, Cmd.none()]
    }
  }
