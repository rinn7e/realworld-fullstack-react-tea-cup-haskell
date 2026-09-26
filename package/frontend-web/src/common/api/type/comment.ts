import * as A from 'fp-ts/lib/Array'
import * as D from 'fp-ts/lib/Date'
import * as EqClass from 'fp-ts/lib/Eq'
import * as N from 'fp-ts/lib/number'
import * as S from 'fp-ts/lib/string'
import * as t from 'io-ts'

import { DateJson } from '@/common/type/date'

import { type Profile, ProfileEq, ProfileJson } from './profile'

export type Comment = {
  id: number
  createdAt: Date
  updatedAt: Date
  body: string
  author: Profile
}

export const CommentEq = EqClass.struct<Comment>({
  id: N.Eq,
  createdAt: D.Eq,
  updatedAt: D.Eq,
  body: S.Eq,
  author: ProfileEq,
})

export const CommentResponseEq = EqClass.struct<CommentResponse>({
  comment: CommentEq,
})

export const CommentsResponseEq = EqClass.struct<CommentsResponse>({
  comments: A.getEq(CommentEq),
})

export const CommentJson: t.Type<Comment, unknown, unknown> = t.type({
  id: t.number,
  createdAt: DateJson,
  updatedAt: DateJson,
  body: t.string,
  author: ProfileJson,
})

export type CommentResponse = {
  comment: Comment
}

export const CommentResponseJson: t.Type<CommentResponse, unknown, unknown> =
  t.type({
    comment: CommentJson,
  })

export type CommentsResponse = {
  comments: Comment[]
}

export const CommentsResponseJson: t.Type<CommentsResponse, unknown, unknown> =
  t.type({
    comments: t.array(CommentJson),
  })
