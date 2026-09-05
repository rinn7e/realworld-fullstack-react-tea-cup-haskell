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
    switch (msg._tag) {
      case 'GetProfileResponse':
        return getProfileResponseHandler(msg.result)(model)
      case 'PaginationMsg':
        return paginationMsgHandler(username, shared)(msg.subMsg, model)
      case 'ToggleFavorites':
        return toggleFavoritesHandler(username, shared)(msg.show)(model)
      case 'Follow':
        return followHandler(username, shared.token)(model)
      case 'FollowResponse':
        return followResponseHandler(msg.result)(model)
      case 'Unfollow':
        return unfollowHandler(username, shared.token)(model)
      case 'UnfollowResponse':
        return unfollowResponseHandler(msg.result)(model)
    }
  }

const getProfileResponseHandler =
  (result: Extract<Msg, { _tag: 'GetProfileResponse' }>['result']) =>
  (model: Model): [Model, Cmd<Msg>] => {
    if (result.tag === 'Ok') {
      return [{ ...model, profile: RD.success(result.value) }, Cmd.none()]
    } else {
      return [{ ...model, profile: RD.failure(result.err) }, Cmd.none()]
    }
  }

const paginationMsgHandler =
  (username: string, shared: Shared) =>
  (
    subMsg: Extract<Msg, { _tag: 'PaginationMsg' }>['subMsg'],
    model: Model,
  ): [Model, Cmd<Msg>] => {
    const [pagination, paginationCmd] = Pagination.update(
      mkPaginationConfig(shared, username, model.showFavorites),
    )(subMsg, model.pagination)

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

const toggleFavoritesHandler =
  (username: string, shared: Shared) =>
  (show: boolean) =>
  (model: Model): [Model, Cmd<Msg>] => {
    if (show === model.showFavorites) {
      return [model, Cmd.none()]
    }
    const [pagination, paginationCmd] = Pagination.init(
      mkPaginationConfig(shared, username, show),
      1,
    )
    const newModel = {
      ...model,
      showFavorites: show,
      pagination,
    }
    return [
      newModel,
      paginationCmd.map((m): Msg => ({ _tag: 'PaginationMsg', subMsg: m })),
    ]
  }

const followHandler =
  (username: string, token: Shared['token']) =>
  (model: Model): [Model, Cmd<Msg>] => {
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
  }

const followResponseHandler =
  (result: Extract<Msg, { _tag: 'FollowResponse' }>['result']) =>
  (model: Model): [Model, Cmd<Msg>] => {
    if (result.tag === 'Ok') {
      return [
        {
          ...model,
          profile: RD.success(result.value),
          followRd: RD.initial,
        },
        Cmd.none(),
      ]
    } else {
      return [{ ...model, followRd: RD.failure(result.err) }, Cmd.none()]
    }
  }

const unfollowHandler =
  (username: string, token: Shared['token']) =>
  (model: Model): [Model, Cmd<Msg>] => {
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
  }

const unfollowResponseHandler =
  (result: Extract<Msg, { _tag: 'UnfollowResponse' }>['result']) =>
  (model: Model): [Model, Cmd<Msg>] => {
    if (result.tag === 'Ok') {
      return [
        {
          ...model,
          profile: RD.success(result.value),
          unfollowRd: RD.initial,
        },
        Cmd.none(),
      ]
    } else {
      return [{ ...model, unfollowRd: RD.failure(result.err) }, Cmd.none()]
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
