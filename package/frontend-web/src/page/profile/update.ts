import * as RD from '@devexperts/remote-data-ts'
import * as Pagination from '@rinn7e/tea-cup-pagination'
import { ArrayExtra, attemptTE, updateAndCmd } from '@rinn7e/tea-cup-prelude'
import * as A from 'fp-ts/lib/Array'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import { Cmd } from 'tea-cup-fp'

import { followUser, getProfile, unfollowUser } from '@/common/api'
import type { Article } from '@/common/api/type/article'
import type { Shared } from '@/common/type/shared'
import * as ArticleShort from '@/component/article-short'

import { mkPaginationConfig } from './helper'
import type { Model, Msg } from './type'

export const init = (
  username: string,
  favorites: boolean,
  shared: Shared,
): [Model, Cmd<Msg>] => {
  const [pagination, paginationCmd] = Pagination.init(
    mkPaginationConfig(shared, username, favorites),
    1,
  )

  const model: Model = {
    profile: RD.pending,
    pagination,
    showFavorites: favorites,
    followRd: RD.initial,
    unfollowRd: RD.initial,
  }

  const token = shared.token

  return [
    model,
    Cmd.batch([
      attemptTE(getProfile(token, username), (result): Msg => ({
        _tag: 'GetProfileResponse',
        result,
      })),
      paginationCmd.map((m): Msg => ({ _tag: 'PaginationMsg', subMsg: m })),
    ]),
  ]
}

export const update =
  (username: string, shared: Shared) =>
  (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
    const token = shared.token
    switch (msg._tag) {
      case 'GetProfileResponse':
        if (msg.result.tag === 'Ok') {
          return [
            { ...model, profile: RD.success(msg.result.value) },
            Cmd.none(),
          ]
        } else {
          return [{ ...model, profile: RD.failure(msg.result.err) }, Cmd.none()]
        }
      case 'PaginationMsg': {
        const [pagination, paginationCmd] = Pagination.update(
          mkPaginationConfig(shared, username, model.showFavorites),
        )(msg.subMsg, model.pagination)

        return pipe(
          [
            { ...model, pagination },
            paginationCmd.map((m): Msg => ({
              _tag: 'PaginationMsg',
              subMsg: m,
            })),
          ] satisfies [Model, Cmd<Msg>],
          updateAndCmd((m) => {
            if (msg.subMsg._tag === 'ItemMsg') {
              return paginationItemMsgHandler(
                shared,
                msg.subMsg.item,
                msg.subMsg.msg,
              )(m)
            } else {
              return [m, Cmd.none()]
            }
          }),
        )
      }
      case 'ToggleFavorites': {
        if (msg.show === model.showFavorites) {
          return [model, Cmd.none()]
        }
        const [pagination, paginationCmd] = Pagination.init(
          mkPaginationConfig(shared, username, msg.show),
          1,
        )
        const newModel = {
          ...model,
          showFavorites: msg.show,
          pagination,
        }
        return [
          newModel,
          paginationCmd.map((m): Msg => ({ _tag: 'PaginationMsg', subMsg: m })),
        ]
      }
      case 'Follow':
        if (token._tag === 'Some') {
          return [
            { ...model, followRd: RD.pending },
            attemptTE(followUser(token.value, username), (result): Msg => ({
              _tag: 'FollowResponse',
              result,
            })),
          ]
        }
        return [model, Cmd.none()]
      case 'FollowResponse':
        if (msg.result.tag === 'Ok') {
          return [
            {
              ...model,
              profile: RD.success(msg.result.value),
              followRd: RD.initial,
            },
            Cmd.none(),
          ]
        } else {
          return [
            { ...model, followRd: RD.failure(msg.result.err) },
            Cmd.none(),
          ]
        }
      case 'Unfollow':
        if (token._tag === 'Some') {
          return [
            { ...model, unfollowRd: RD.pending },
            attemptTE(unfollowUser(token.value, username), (result): Msg => ({
              _tag: 'UnfollowResponse',
              result,
            })),
          ]
        }
        return [model, Cmd.none()]
      case 'UnfollowResponse':
        if (msg.result.tag === 'Ok') {
          return [
            {
              ...model,
              profile: RD.success(msg.result.value),
              unfollowRd: RD.initial,
            },
            Cmd.none(),
          ]
        } else {
          return [
            { ...model, unfollowRd: RD.failure(msg.result.err) },
            Cmd.none(),
          ]
        }
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
