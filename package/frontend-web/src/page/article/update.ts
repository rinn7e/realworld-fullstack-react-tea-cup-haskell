import * as RD from '@devexperts/remote-data-ts'
import { attemptTE } from '@rinn7e/tea-cup-prelude'
import { Cmd } from 'tea-cup-fp'

import {
  deleteArticle,
  favoriteArticle,
  favoriteArticleUtil,
  followUser,
  getArticle,
  unfavoriteArticle,
  unfavoriteArticleUtil,
  unfollowUser,
} from '@/common/api'
import type { Shared } from '@/common/type/shared'

import * as CommentSection from './sub-component/comment-section'
import { type Model, type Msg } from './type'

export const init = (slug: string, shared: Shared): [Model, Cmd<Msg>] => {
  const [commentSection, commentSectionCmd] = CommentSection.init(slug, shared)
  const model: Model = {
    slug,
    article: RD.pending,
    commentSection,
  }

  return [
    model,
    Cmd.batch<Msg>([
      attemptTE(getArticle(shared.token, slug), (result): Msg => ({
        _tag: 'GetArticleResponse',
        result,
      })),
      commentSectionCmd.map((subMsg) => ({
        _tag: 'CommentSectionMsg',
        subMsg,
      })),
    ]),
  ]
}

export const update =
  (shared: Shared) =>
  (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
    switch (msg._tag) {
      case 'GetArticleResponse':
        return getArticleResponseHandler(msg.result)(model)
      case 'FavoriteArticle':
        return favoriteArticleHandler(shared.token)(model)
      case 'UnfavoriteArticle':
        return unfavoriteArticleHandler(shared.token)(model)
      case 'FavoriteArticleResponse':
        return favoriteArticleResponseHandler(msg.result)(model)
      case 'UnfavoriteArticleResponse':
        return unfavoriteArticleResponseHandler(msg.result)(model)
      case 'FollowAuthor':
        return followAuthorHandler(shared.token, msg.username)(model)
      case 'UnfollowAuthor':
        return unfollowAuthorHandler(shared.token, msg.username)(model)
      case 'FollowAuthorResponse':
        return followAuthorResponseHandler(msg.result)(model)
      case 'UnfollowAuthorResponse':
        return unfollowAuthorResponseHandler(msg.result)(model)
      case 'DeleteArticle':
        return deleteArticleHandler(shared.token)(model)
      case 'DeleteArticleResponse':
        return deleteArticleResponseHandler(model)
      case 'CommentSectionMsg':
        return commentSectionMsgHandler(shared)(msg.subMsg, model)
    }
  }

const getArticleResponseHandler =
  (result: Extract<Msg, { _tag: 'GetArticleResponse' }>['result']) =>
  (model: Model): [Model, Cmd<Msg>] => {
    if (result.tag === 'Ok') {
      return [{ ...model, article: RD.success(result.value) }, Cmd.none()]
    } else {
      return [{ ...model, article: RD.failure(result.err) }, Cmd.none()]
    }
  }

const favoriteArticleHandler =
  (token: Shared['token']) =>
  (model: Model): [Model, Cmd<Msg>] => {
    if (token._tag === 'Some' && model.article._tag === 'RemoteSuccess') {
      return [
        {
          ...model,
          article: RD.success({
            article: favoriteArticleUtil(model.article.value.article),
          }),
        },
        attemptTE(favoriteArticle(token.value, model.slug), (result): Msg => ({
          _tag: 'FavoriteArticleResponse',
          result,
        })),
      ]
    }
    return [model, Cmd.none()]
  }

const unfavoriteArticleHandler =
  (token: Shared['token']) =>
  (model: Model): [Model, Cmd<Msg>] => {
    if (token._tag === 'Some' && model.article._tag === 'RemoteSuccess') {
      return [
        {
          ...model,
          article: RD.success({
            article: unfavoriteArticleUtil(model.article.value.article),
          }),
        },
        attemptTE(
          unfavoriteArticle(token.value, model.slug),
          (result): Msg => ({ _tag: 'UnfavoriteArticleResponse', result }),
        ),
      ]
    }
    return [model, Cmd.none()]
  }

const favoriteArticleResponseHandler =
  (result: Extract<Msg, { _tag: 'FavoriteArticleResponse' }>['result']) =>
  (model: Model): [Model, Cmd<Msg>] => {
    if (result.tag === 'Ok') {
      return [{ ...model, article: RD.success(result.value) }, Cmd.none()]
    } else {
      if (model.article._tag === 'RemoteSuccess') {
        const revertedArticle = unfavoriteArticleUtil(
          model.article.value.article,
        )
        return [
          {
            ...model,
            article: RD.success({ article: revertedArticle }),
          },
          Cmd.none(),
        ]
      }
      return [model, Cmd.none()]
    }
  }

const unfavoriteArticleResponseHandler =
  (result: Extract<Msg, { _tag: 'UnfavoriteArticleResponse' }>['result']) =>
  (model: Model): [Model, Cmd<Msg>] => {
    if (result.tag === 'Ok') {
      return [{ ...model, article: RD.success(result.value) }, Cmd.none()]
    } else {
      if (model.article._tag === 'RemoteSuccess') {
        const revertedArticle = favoriteArticleUtil(model.article.value.article)
        return [
          {
            ...model,
            article: RD.success({ article: revertedArticle }),
          },
          Cmd.none(),
        ]
      }
      return [model, Cmd.none()]
    }
  }

const followAuthorHandler =
  (token: Shared['token'], username: string) =>
  (model: Model): [Model, Cmd<Msg>] => {
    if (token._tag === 'Some') {
      return [
        model,
        attemptTE(followUser(token.value, username), (result): Msg => ({
          _tag: 'FollowAuthorResponse',
          result,
        })),
      ]
    }
    return [model, Cmd.none()]
  }

const unfollowAuthorHandler =
  (token: Shared['token'], username: string) =>
  (model: Model): [Model, Cmd<Msg>] => {
    if (token._tag === 'Some') {
      return [
        model,
        attemptTE(unfollowUser(token.value, username), (result): Msg => ({
          _tag: 'UnfollowAuthorResponse',
          result,
        })),
      ]
    }
    return [model, Cmd.none()]
  }

const followAuthorResponseHandler =
  (result: Extract<Msg, { _tag: 'FollowAuthorResponse' }>['result']) =>
  (model: Model): [Model, Cmd<Msg>] => {
    if (result.tag === 'Ok' && model.article._tag === 'RemoteSuccess') {
      return [
        {
          ...model,
          article: RD.success({
            article: {
              ...model.article.value.article,
              author: result.value.profile,
            },
          }),
        },
        Cmd.none(),
      ]
    }
    return [model, Cmd.none()]
  }

const unfollowAuthorResponseHandler =
  (result: Extract<Msg, { _tag: 'UnfollowAuthorResponse' }>['result']) =>
  (model: Model): [Model, Cmd<Msg>] => {
    if (result.tag === 'Ok' && model.article._tag === 'RemoteSuccess') {
      return [
        {
          ...model,
          article: RD.success({
            article: {
              ...model.article.value.article,
              author: result.value.profile,
            },
          }),
        },
        Cmd.none(),
      ]
    }
    return [model, Cmd.none()]
  }

const deleteArticleHandler =
  (token: Shared['token']) =>
  (model: Model): [Model, Cmd<Msg>] => {
    if (token._tag === 'Some') {
      return [
        model,
        attemptTE(deleteArticle(token.value, model.slug), (result): Msg => ({
          _tag: 'DeleteArticleResponse',
          result,
        })),
      ]
    }
    return [model, Cmd.none()]
  }

const deleteArticleResponseHandler = (model: Model): [Model, Cmd<Msg>] => [
  model,
  Cmd.none(),
]

const commentSectionMsgHandler =
  (shared: Shared) =>
  (
    subMsg: Extract<Msg, { _tag: 'CommentSectionMsg' }>['subMsg'],
    model: Model,
  ): [Model, Cmd<Msg>] => {
    const [commentSection, commentSectionCmd] = CommentSection.update(
      model.slug,
      shared,
    )(subMsg, model.commentSection)
    return [
      { ...model, commentSection },
      commentSectionCmd.map((subMsg) => ({
        _tag: 'CommentSectionMsg',
        subMsg,
      })),
    ]
  }
