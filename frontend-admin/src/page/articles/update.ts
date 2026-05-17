import * as RD from '@devexperts/remote-data-ts'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import { Cmd } from 'tea-cup-fp'

import { updateAndCmd } from '@rinn7e/tea-cup-prelude'
import type { Shared } from '@/type'
import * as Pagination from '@rinn7e/tea-cup-pagination'

import { mkPaginationConfig } from './helper'
import { type Model, type Msg } from './type'

export const init = (shared: Shared): [Model, Cmd<Msg>] => {
  const initialModel: Model = {
    _tag: 'ArticlesModel',
    pagination: {
      items: RD.pending,
      page: 1,
      pageAmount: 0,
    },
    selectedArticle: O.none,
    searchText: '',
    sort: { attr: 'createdAt', direction: 'desc' },
  }

  const paginationConfig = mkPaginationConfig(shared, initialModel)
  const [pagination, paginationCmd] = Pagination.init(paginationConfig, 1)

  const model: Model = {
    ...initialModel,
    pagination,
  }

  return [
    model,
    paginationCmd.map((m): Msg => ({ _tag: 'PaginationMsg', subMsg: m })),
  ]
}

export const update =
  (shared: Shared) =>
  (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
    switch (msg._tag) {
      case 'SelectArticle':
        return [{ ...model, selectedArticle: msg.article }, Cmd.none()]
      case 'ChangeSearchText': {
        const nextModel = { ...model, searchText: msg.text }
        const paginationConfig = mkPaginationConfig(shared, nextModel)
        const [pagination, paginationCmd] = Pagination.init(paginationConfig, 1)
        return [
          {
            ...nextModel,
            pagination,
          },
          paginationCmd.map((m): Msg => ({ _tag: 'PaginationMsg', subMsg: m })),
        ]
      }
      case 'ChangeSort': {
        const nextModel = { ...model, sort: msg.sort }
        const paginationConfig = mkPaginationConfig(shared, nextModel)
        const [pagination, paginationCmd] = Pagination.init(paginationConfig, 1)
        return [
          {
            ...nextModel,
            pagination,
          },
          paginationCmd.map((m): Msg => ({ _tag: 'PaginationMsg', subMsg: m })),
        ]
      }
      case 'PaginationMsg': {
        const paginationConfig = mkPaginationConfig(shared, model)
        const [pagination, paginationCmd] = Pagination.update(paginationConfig)(
          msg.subMsg,
          model.pagination,
        )

        return pipe(
          [
            { ...model, pagination },
            paginationCmd.map((m): Msg => ({ _tag: 'PaginationMsg', subMsg: m })),
          ] as [Model, Cmd<Msg>],
          updateAndCmd((m) => {
            if (msg.subMsg._tag === 'ItemMsg') {
              return paginationItemMsgHandler(msg.subMsg.msg)(m)
            } else {
              return [m, Cmd.none()]
            }
          }),
        )
      }
      case 'NoOp':
        return [model, Cmd.none()]
    }
  }

const paginationItemMsgHandler =
  (msg: any) =>
  (m: Model): [Model, Cmd<Msg>] => {
    switch (msg._tag) {
      case 'SelectArticle':
        return [{ ...m, selectedArticle: msg.article }, Cmd.none()]
      default:
        return [m, Cmd.none()]
    }
  }
