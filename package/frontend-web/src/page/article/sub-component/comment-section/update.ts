import * as RD from '@devexperts/remote-data-ts'
import { attemptTE } from '@rinn7e/tea-cup-prelude'
import { Cmd } from 'tea-cup-fp'

import { createComment, deleteComment, getComments } from '@/common/api'
import type { Shared } from '@/common/type/shared'

import type { Model, Msg } from './type'

export const init = (slug: string, shared: Shared): [Model, Cmd<Msg>] => {
  const model: Model = {
    comments: RD.pending,
    newCommentInput: '',
    newCommentError: null,
  }

  return [
    model,
    attemptTE(getComments(shared.token, slug), (result): Msg => ({
      _tag: 'GetCommentsResponse',
      result,
    })),
  ]
}

export const update =
  (slug: string, shared: Shared) =>
  (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
    switch (msg._tag) {
      case 'GetCommentsResponse':
        if (msg.result.tag === 'Ok') {
          return [
            { ...model, comments: RD.success(msg.result.value) },
            Cmd.none(),
          ]
        } else {
          return [
            { ...model, comments: RD.failure(msg.result.err) },
            Cmd.none(),
          ]
        }
      case 'SetCommentInput':
        return [{ ...model, newCommentInput: msg.value }, Cmd.none()]
      case 'SubmitComment':
        if (
          shared.token._tag === 'Some' &&
          model.newCommentInput.trim() !== ''
        ) {
          return [
            { ...model, newCommentInput: '', newCommentError: null },
            attemptTE(
              createComment(shared.token.value, slug, model.newCommentInput),
              (result): Msg => ({ _tag: 'SubmitCommentResponse', result }),
            ),
          ]
        }
        return [model, Cmd.none()]
      case 'SubmitCommentResponse':
        if (msg.result.tag === 'Ok') {
          if (model.comments._tag === 'RemoteSuccess') {
            return [
              {
                ...model,
                newCommentError: null,
                comments: RD.success({
                  comments: [
                    msg.result.value.comment,
                    ...model.comments.value.comments,
                  ],
                }),
              },
              Cmd.none(),
            ]
          }
        } else {
          return [{ ...model, newCommentError: msg.result.err }, Cmd.none()]
        }
        return [model, Cmd.none()]
      case 'DeleteComment':
        if (shared.token._tag === 'Some') {
          return [
            { ...model, newCommentError: null },
            attemptTE(
              deleteComment(shared.token.value, slug, msg.id),
              (result): Msg => ({
                _tag: 'DeleteCommentResponse',
                id: msg.id,
                result,
              }),
            ),
          ]
        }
        return [model, Cmd.none()]
      case 'DeleteCommentResponse':
        if (
          msg.result.tag === 'Ok' &&
          model.comments._tag === 'RemoteSuccess'
        ) {
          return [
            {
              ...model,
              newCommentError: null,
              comments: RD.success({
                comments: model.comments.value.comments.filter(
                  (c) => c.id !== msg.id,
                ),
              }),
            },
            Cmd.none(),
          ]
        } else if (msg.result.tag === 'Err') {
          return [{ ...model, newCommentError: msg.result.err }, Cmd.none()]
        }

        return [model, Cmd.none()]
    }
  }
