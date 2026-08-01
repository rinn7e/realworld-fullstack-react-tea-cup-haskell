import { UndefinableEq } from '@rinn7e/tea-cup-prelude'
import * as A from 'fp-ts/lib/Array'
import * as EqClass from 'fp-ts/lib/Eq'
import * as B from 'fp-ts/lib/boolean'
import * as N from 'fp-ts/lib/number'
import * as S from 'fp-ts/lib/string'
import * as t from 'io-ts'

import { type Profile, ProfileEq, ProfileJson } from './profile'

export type Article = {
  slug: string
  title: string
  description: string
  body?: string
  tagList: string[]
  createdAt: string
  updatedAt: string
  favorited: boolean
  favoritesCount: number
  author: Profile
}

export const ArticleEq = EqClass.struct<Article>({
  slug: S.Eq,
  title: S.Eq,
  description: S.Eq,
  body: UndefinableEq(S.Eq),
  tagList: A.getEq(S.Eq),
  createdAt: S.Eq,
  updatedAt: S.Eq,
  favorited: B.Eq,
  favoritesCount: N.Eq,
  author: ProfileEq,
})

export const ArticleResponseEq = EqClass.struct<ArticleResponse>({
  article: ArticleEq,
})

export const ArticlesResponseEq = EqClass.struct<ArticlesResponse>({
  articles: A.getEq(ArticleEq),
  articlesCount: N.Eq,
})

export const ArticleJson: t.Type<Article> = t.intersection([
  t.type({
    slug: t.string,
    title: t.string,
    description: t.string,
    tagList: t.array(t.string),
    createdAt: t.string,
    updatedAt: t.string,
    favorited: t.boolean,
    favoritesCount: t.number,
    author: ProfileJson,
  }),
  t.partial({
    body: t.string,
  }),
])

export type ArticleResponse = {
  article: Article
}

export const ArticleResponseJson: t.Type<ArticleResponse> = t.type({
  article: ArticleJson,
})

export type ArticlesResponse = {
  articles: Article[]
  articlesCount: number
}

export const ArticlesResponseJson: t.Type<ArticlesResponse> = t.type({
  articles: t.array(ArticleJson),
  articlesCount: t.number,
})

export type NewArticleRequest = {
  article: {
    title: string
    description: string
    body: string
    tagList?: string[]
  }
}

export type UpdateArticleRequest = {
  article: {
    title?: string
    description?: string
    body?: string
  }
}
export const favoriteArticleUtil = (a: Article): Article => ({
  ...a,
  favorited: true,
  favoritesCount: a.favorited ? a.favoritesCount : a.favoritesCount + 1,
})

export const unfavoriteArticleUtil = (a: Article): Article => ({
  ...a,
  favorited: false,
  favoritesCount: a.favorited ? a.favoritesCount - 1 : a.favoritesCount,
})
