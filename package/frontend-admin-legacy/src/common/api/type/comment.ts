import * as EqClass from 'fp-ts/lib/Eq'
import * as N from 'fp-ts/lib/number'
import * as S from 'fp-ts/lib/string'
import * as t from 'io-ts'

import { type Profile, ProfileEq, ProfileJson } from './profile'

export type CommentSortAttr = 'id' | 'createdAt' | 'author'

export type Comment = {
  id: number
  body: string
  createdAt: string
  updatedAt: string
  articleSlug: string
  author: Profile
}

export const CommentEq = EqClass.struct<Comment>({
  id: N.Eq,
  body: S.Eq,
  createdAt: S.Eq,
  updatedAt: S.Eq,
  articleSlug: S.Eq,
  author: ProfileEq,
})

export const CommentJson: t.Type<Comment> = t.type({
  id: t.number,
  body: t.string,
  createdAt: t.string,
  updatedAt: t.string,
  articleSlug: t.string,
  author: ProfileJson,
})

export type CommentListResponse = {
  comments: Comment[]
  totalCount: number
}

export const CommentListResponseJson = t.type({
  comments: t.array(CommentJson),
  totalCount: t.number,
})
