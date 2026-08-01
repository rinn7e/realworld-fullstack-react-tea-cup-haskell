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
        if (msg.result.tag === 'Ok') {
          return [
            { ...model, article: RD.success(msg.result.value) },
            Cmd.none(),
          ]
        } else {
          return [{ ...model, article: RD.failure(msg.result.err) }, Cmd.none()]
        }
      case 'FavoriteArticle':
        if (
          shared.token._tag === 'Some' &&
          model.article._tag === 'RemoteSuccess'
        ) {
          return [
            {
              ...model,
              article: RD.success({
                article: favoriteArticleUtil(model.article.value.article),
              }),
            },
            attemptTE(
              favoriteArticle(shared.token.value, model.slug),
              (result): Msg => ({ _tag: 'FavoriteArticleResponse', result }),
            ),
          ]
        }
        return [model, Cmd.none()]
      case 'UnfavoriteArticle':
        if (
          shared.token._tag === 'Some' &&
          model.article._tag === 'RemoteSuccess'
        ) {
          return [
            {
              ...model,
              article: RD.success({
                article: unfavoriteArticleUtil(model.article.value.article),
              }),
            },
            attemptTE(
              unfavoriteArticle(shared.token.value, model.slug),
              (result): Msg => ({ _tag: 'UnfavoriteArticleResponse', result }),
            ),
          ]
        }
        return [model, Cmd.none()]
      case 'FavoriteArticleResponse':
      case 'UnfavoriteArticleResponse':
        if (msg.result.tag === 'Ok') {
          return [
            { ...model, article: RD.success(msg.result.value) },
            Cmd.none(),
          ]
        } else {
          if (model.article._tag === 'RemoteSuccess') {
            const revertedArticle =
              msg._tag === 'FavoriteArticleResponse'
                ? unfavoriteArticleUtil(model.article.value.article)
                : favoriteArticleUtil(model.article.value.article)
            return [
              {
                ...model,
                article: RD.success({ article: revertedArticle }),
              },
              Cmd.none(),
            ]
          }
        }
        return [model, Cmd.none()]
      case 'FollowAuthor':
        if (shared.token._tag === 'Some') {
          return [
            model,
            attemptTE(
              followUser(shared.token.value, msg.username),
              (result): Msg => ({ _tag: 'FollowAuthorResponse', result }),
            ),
          ]
        }
        return [model, Cmd.none()]
      case 'UnfollowAuthor':
        if (shared.token._tag === 'Some') {
          return [
            model,
            attemptTE(
              unfollowUser(shared.token.value, msg.username),
              (result): Msg => ({ _tag: 'UnfollowAuthorResponse', result }),
            ),
          ]
        }
        return [model, Cmd.none()]
      case 'FollowAuthorResponse':
      case 'UnfollowAuthorResponse':
        if (msg.result.tag === 'Ok' && model.article._tag === 'RemoteSuccess') {
          return [
            {
              ...model,
              article: RD.success({
                article: {
                  ...model.article.value.article,
                  author: msg.result.value.profile,
                },
              }),
            },
            Cmd.none(),
          ]
        }
        return [model, Cmd.none()]
      case 'DeleteArticle':
        if (shared.token._tag === 'Some') {
          return [
            model,
            attemptTE(
              deleteArticle(shared.token.value, model.slug),
              (result): Msg => ({ _tag: 'DeleteArticleResponse', result }),
            ),
          ]
        }
        return [model, Cmd.none()]
      case 'DeleteArticleResponse':
        return [model, Cmd.none()]
      case 'CommentSectionMsg': {
        const [commentSection, commentSectionCmd] = CommentSection.update(
          model.slug,
          shared,
        )(msg.subMsg, model.commentSection)
        return [
          { ...model, commentSection },
          commentSectionCmd.map((subMsg) => ({
            _tag: 'CommentSectionMsg',
            subMsg,
          })),
        ]
      }
    }
  }
