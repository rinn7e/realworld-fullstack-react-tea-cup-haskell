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
        return getCommentsResponseHandler(msg.result)(model)
      case 'SetCommentInput':
        return setCommentInputHandler(msg.value)(model)
      case 'SubmitComment':
        return submitCommentHandler(slug, shared.token)(model)
      case 'SubmitCommentResponse':
        return submitCommentResponseHandler(msg.result)(model)
      case 'DeleteComment':
        return deleteCommentHandler(slug, shared.token, msg.id)(model)
      case 'DeleteCommentResponse':
        return deleteCommentResponseHandler(msg.id, msg.result)(model)
    }
  }

const getCommentsResponseHandler =
  (result: Extract<Msg, { _tag: 'GetCommentsResponse' }>['result']) =>
  (model: Model): [Model, Cmd<Msg>] => {
    if (result.tag === 'Ok') {
      return [{ ...model, comments: RD.success(result.value) }, Cmd.none()]
    } else {
      return [{ ...model, comments: RD.failure(result.err) }, Cmd.none()]
    }
  }

const setCommentInputHandler =
  (value: string) =>
  (model: Model): [Model, Cmd<Msg>] => [
    { ...model, newCommentInput: value },
    Cmd.none(),
  ]

const submitCommentHandler =
  (slug: string, token: Shared['token']) =>
  (model: Model): [Model, Cmd<Msg>] => {
    if (token._tag === 'Some' && model.newCommentInput.trim() !== '') {
      return [
        { ...model, newCommentInput: '', newCommentError: null },
        attemptTE(
          createComment(token.value, slug, model.newCommentInput),
          (result): Msg => ({ _tag: 'SubmitCommentResponse', result }),
        ),
      ]
    }
    return [model, Cmd.none()]
  }

const submitCommentResponseHandler =
  (result: Extract<Msg, { _tag: 'SubmitCommentResponse' }>['result']) =>
  (model: Model): [Model, Cmd<Msg>] => {
    if (result.tag === 'Ok') {
      if (model.comments._tag === 'RemoteSuccess') {
        return [
          {
            ...model,
            newCommentError: null,
            comments: RD.success({
              comments: [
                result.value.comment,
                ...model.comments.value.comments,
              ],
            }),
          },
          Cmd.none(),
        ]
      }
    } else {
      return [{ ...model, newCommentError: result.err }, Cmd.none()]
    }
    return [model, Cmd.none()]
  }

const deleteCommentHandler =
  (slug: string, token: Shared['token'], id: number) =>
  (model: Model): [Model, Cmd<Msg>] => {
    if (token._tag === 'Some') {
      return [
        { ...model, newCommentError: null },
        attemptTE(deleteComment(token.value, slug, id), (result): Msg => ({
          _tag: 'DeleteCommentResponse',
          id,
          result,
        })),
      ]
    }
    return [model, Cmd.none()]
  }

const deleteCommentResponseHandler =
  (
    id: number,
    result: Extract<Msg, { _tag: 'DeleteCommentResponse' }>['result'],
  ) =>
  (model: Model): [Model, Cmd<Msg>] => {
    if (result.tag === 'Ok' && model.comments._tag === 'RemoteSuccess') {
      return [
        {
          ...model,
          newCommentError: null,
          comments: RD.success({
            comments: model.comments.value.comments.filter((c) => c.id !== id),
          }),
        },
        Cmd.none(),
      ]
    } else if (result.tag === 'Err') {
      return [{ ...model, newCommentError: result.err }, Cmd.none()]
    }

    return [model, Cmd.none()]
  }
