import * as A from 'fp-ts/lib/Array'
import * as EqClass from 'fp-ts/lib/Eq'
import * as B from 'fp-ts/lib/boolean'
import * as N from 'fp-ts/lib/number'
import * as S from 'fp-ts/lib/string'
import * as t from 'io-ts'

import { type AdminUser, AdminUserEq, AdminUserJson } from './user'

export type Article = {
  id: number
  slug: string
  title: string
  description: string
  body: string
  tagList: string[]
  createdAt: string
  updatedAt: string
  favorited: boolean
  favoritesCount: number
  author: AdminUser
}

export const ArticleEq = EqClass.struct<Article>({
  id: N.Eq,
  slug: S.Eq,
  title: S.Eq,
  description: S.Eq,
  body: S.Eq,
  tagList: A.getEq(S.Eq),
  createdAt: S.Eq,
  updatedAt: S.Eq,
  favorited: B.Eq,
  favoritesCount: N.Eq,
  author: AdminUserEq,
})

export const ArticleJson: t.Type<Article> = t.type({
  id: t.number,
  slug: t.string,
  title: t.string,
  description: t.string,
  body: t.string,
  tagList: t.array(t.string),
  createdAt: t.string,
  updatedAt: t.string,
  favorited: t.boolean,
  favoritesCount: t.number,
  author: AdminUserJson,
})

export type ArticleListResponse = {
  articles: Article[]
  articlesCount: number
}

export const ArticleListResponseJson = t.type({
  articles: t.array(ArticleJson),
  articlesCount: t.number,
})
