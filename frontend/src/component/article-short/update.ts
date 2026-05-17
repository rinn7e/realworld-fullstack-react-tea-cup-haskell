import { attemptTE } from '@rinn7e/tea-cup-prelude'
import { Cmd } from 'tea-cup-fp'

import {
  favoriteArticle,
  favoriteArticleUtil,
  unfavoriteArticle,
  unfavoriteArticleUtil,
} from '@/common/api'
import type { Shared } from '@/common/type/shared'

import type { Model, Msg } from './type'

export const init = (article: Model): Model => article

export const update =
  (shared: Shared) =>
  (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
    switch (msg._tag) {
      case 'Favorite':
        if (shared.token._tag === 'Some') {
          return [
            favoriteArticleUtil(model),
            attemptTE(
              favoriteArticle(shared.token.value, model.slug),
              (result): Msg => ({ _tag: 'FavoriteResponse', result }),
            ),
          ]
        }
        return [model, Cmd.none()]
      case 'Unfavorite':
        if (shared.token._tag === 'Some') {
          return [
            unfavoriteArticleUtil(model),
            attemptTE(
              unfavoriteArticle(shared.token.value, model.slug),
              (result): Msg => ({ _tag: 'UnfavoriteResponse', result }),
            ),
          ]
        }
        return [model, Cmd.none()]
      case 'FavoriteResponse':
        if (msg.result.tag === 'Ok') {
          return [msg.result.value.article, Cmd.none()]
        } else {
          return [unfavoriteArticleUtil(model), Cmd.none()]
        }
      case 'UnfavoriteResponse':
        if (msg.result.tag === 'Ok') {
          return [msg.result.value.article, Cmd.none()]
        } else {
          return [favoriteArticleUtil(model), Cmd.none()]
        }
    }
  }
