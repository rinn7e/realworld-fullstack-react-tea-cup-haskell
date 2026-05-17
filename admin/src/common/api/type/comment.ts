import * as EqClass from 'fp-ts/lib/Eq'
import * as N from 'fp-ts/lib/number'
import * as S from 'fp-ts/lib/string'
import * as t from 'io-ts'

export type Comment = {
  id: number
  body: string
  createdAt: string
  articleSlug: string
  authorUsername: string
}

export const CommentEq = EqClass.struct<Comment>({
  id: N.Eq,
  body: S.Eq,
  createdAt: S.Eq,
  articleSlug: S.Eq,
  authorUsername: S.Eq,
})

export const CommentJson: t.Type<Comment> = t.type({
  id: t.number,
  body: t.string,
  createdAt: t.string,
  articleSlug: t.string,
  authorUsername: t.string,
})

export type CommentListResponse = {
  comments: Comment[]
  totalCount: number
}

export const CommentListResponseJson = t.type({
  comments: t.array(CommentJson),
  totalCount: t.number,
})
