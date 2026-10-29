import * as D from 'fp-ts/lib/Date'
import * as EqClass from 'fp-ts/lib/Eq'
import * as N from 'fp-ts/lib/number'
import * as S from 'fp-ts/lib/string'
import * as t from 'io-ts'

import { DateJson } from '@/common/type/date'

import { type Profile, ProfileEq, ProfileJson } from './profile'

export type CommentSortAttr = 'id' | 'createdAt' | 'author'

export type Comment = {
  id: number
  body: string
  createdAt: Date
  updatedAt: Date
  articleSlug: string
  author: Profile
}

export const CommentEq = EqClass.struct<Comment>({
  id: N.Eq,
  body: S.Eq,
  createdAt: D.Eq,
  updatedAt: D.Eq,
  articleSlug: S.Eq,
  author: ProfileEq,
})

export const CommentJson: t.Type<Comment, unknown, unknown> = t.type({
  id: t.number,
  body: t.string,
  createdAt: DateJson,
  updatedAt: DateJson,
  articleSlug: t.string,
  author: ProfileJson,
})

export type CommentListResponse = {
  comments: Comment[]
  totalCount: number
}

export const CommentListResponseJson: t.Type<
  CommentListResponse,
  unknown,
  unknown
> = t.type({
  comments: t.array(CommentJson),
  totalCount: t.number,
})
