import * as RD from '@devexperts/remote-data-ts'
import * as Pagination from '@rinn7e/tea-cup-pagination'
import { ArrayExtra, attemptTE, updateAndCmd } from '@rinn7e/tea-cup-prelude'
import * as A from 'fp-ts/lib/Array'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import { Cmd, type Result } from 'tea-cup-fp'

import {
  type ApiError,
  type HttpError,
  type TagsResponse,
  getTags,
} from '@/common/api'
import type { Article } from '@/common/api/type/article'
import { type HomeTab, HomeTabEq } from '@/common/type/route'
import type { Shared } from '@/common/type/shared'
import * as ArticleShort from '@/component/article-short'

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

      attemptTE(getTags(shared.token), (result): Msg => ({
        _tag: 'GetTagsResponse',
        result,
      })),
    ]),
  ]
}

export const update =
  (shared: Shared) =>
  (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
    switch (msg._tag) {
      case 'GetTagsResponse': {
        return getTagsResponseHandler(msg.result)(model)
      }
      case 'PaginationMsg': {
        return paginationMsgHandler(shared)(msg.subMsg, model)
      }
      case 'ChangeTab': {
        return changeTabHandler(shared)(msg.tab, model)
      }
      case 'NoOp': {
        return [model, Cmd.none()]
      }
    }
  }

const getTagsResponseHandler =
  (result: Result<HttpError<ApiError>, TagsResponse>) =>
  (model: Model): [Model, Cmd<Msg>] => {
    if (result.tag === 'Ok') {
      return [{ ...model, tags: RD.success(result.value) }, Cmd.none()]
    } else {
      return [{ ...model, tags: RD.failure(result.err) }, Cmd.none()]
    }
  }

const paginationMsgHandler =
  (shared: Shared) =>
  (
    subMsg: Extract<Msg, { _tag: 'PaginationMsg' }>['subMsg'],
    model: Model,
  ): [Model, Cmd<Msg>] => {
    const paginationConfig = mkPaginationConfig(shared, model.tab)
    const [pagination, paginationCmd] = Pagination.update(paginationConfig)(
      subMsg,
      model.pagination,
    )

    return pipe(
      [
        { ...model, pagination },
        paginationCmd.map((m): Msg => ({
          _tag: 'PaginationMsg',
          subMsg: m,
        })),
      ] satisfies [Model, Cmd<Msg>],
      updateAndCmd((m) => {
        if (subMsg._tag === 'ItemMsg') {
          return paginationItemMsgHandler(shared, subMsg.item, subMsg.msg)(m)
        } else {
          return [m, Cmd.none()]
        }
      }),
    )
  }

const changeTabHandler =
  (shared: Shared) =>
  (tab: HomeTab, model: Model): [Model, Cmd<Msg>] => {
    if (HomeTabEq.equals(tab, model.tab)) {
      return [model, Cmd.none()]
    } else {
      const paginationConfig = mkPaginationConfig(shared, tab)
      const [pagination, paginationCmd] = Pagination.init(paginationConfig, 1)
      const newModel: Model = {
        ...model,
        tab,
        pagination,
      }

      return [
        newModel,
        paginationCmd.map((m): Msg => ({
          _tag: 'PaginationMsg',
          subMsg: m,
        })),
      ]
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
              subCmd.map((sm): Msg => ({
                _tag: 'PaginationMsg',
                subMsg: {
                  _tag: 'ItemMsg',
                  item: updated,
                  msg: sm,
                },
              })),
            ]
          },
        ),
      )
    } else {
      return [m, Cmd.none()]
    }
  }
