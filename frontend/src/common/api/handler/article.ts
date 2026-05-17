import { type Option } from 'fp-ts/lib/Option'
import * as TE from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/function'

import { API_BASE } from '@/common/env'

import {
  type ArticleResponse,
  ArticleResponseJson,
  type ArticlesResponse,
  ArticlesResponseJson,
  type NewArticleRequest,
  type UpdateArticleRequest,
} from '../type/article'
import { type ApiError, type HttpError } from '../type/common'
import {
  decodeApiError,
  decodeSuccess,
  ensureIsOk,
  fetchToTaskEither,
} from './common'

export const getArticles = (
  token: Option<string>,
  params: {
    tag?: string
    author?: string
    favorited?: string
    offset?: number
    limit?: number
  } = {},
): TE.TaskEither<HttpError<ApiError>, ArticlesResponse> => {
  const query = new URLSearchParams()
  if (params.tag !== undefined) query.set('tag', params.tag)
  if (params.author !== undefined) query.set('author', params.author)
  if (params.favorited !== undefined) query.set('favorited', params.favorited)
  if (params.offset !== undefined) query.set('offset', String(params.offset))
  if (params.limit !== undefined) query.set('limit', String(params.limit))
  const qs = query.toString()
  return pipe(
    fetch(
      `${API_BASE}/articles${qs ? `?${qs}` : ''}`,
      token._tag === 'Some'
        ? {
            headers: { Authorization: `Token ${token.value}` },
          }
        : undefined,
    ),
    fetchToTaskEither,
    TE.chainEitherK(decodeSuccess(ArticlesResponseJson)),
    TE.mapLeft(decodeApiError),
  )
}

export const getArticlesFeed = (
  token: string,
  params: { offset?: number; limit?: number } = {},
): TE.TaskEither<HttpError<ApiError>, ArticlesResponse> => {
  const query = new URLSearchParams()
  if (params.offset !== undefined) query.set('offset', String(params.offset))
  if (params.limit !== undefined) query.set('limit', String(params.limit))
  const qs = query.toString()
  return pipe(
    fetch(`${API_BASE}/articles/feed${qs ? `?${qs}` : ''}`, {
      headers: { Authorization: `Token ${token}` },
    }),
    fetchToTaskEither,
    TE.chainEitherK(decodeSuccess(ArticlesResponseJson)),
    TE.mapLeft(decodeApiError),
  )
}

export const getArticle = (
  token: Option<string>,
  slug: string,
): TE.TaskEither<HttpError<ApiError>, ArticleResponse> =>
  pipe(
    fetch(
      `${API_BASE}/articles/${encodeURIComponent(slug)}`,
      token._tag === 'Some'
        ? { headers: { Authorization: `Token ${token.value}` } }
        : undefined,
    ),
    fetchToTaskEither,
    TE.chainEitherK(decodeSuccess(ArticleResponseJson)),
    TE.mapLeft(decodeApiError),
  )

export const createArticle = (
  token: string,
  request: NewArticleRequest,
): TE.TaskEither<HttpError<ApiError>, ArticleResponse> =>
  pipe(
    fetch(`${API_BASE}/articles/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(request),
    }),
    fetchToTaskEither,
    TE.chainEitherK(decodeSuccess(ArticleResponseJson)),
    TE.mapLeft(decodeApiError),
  )

export const updateArticle = (
  token: string,
  slug: string,
  request: UpdateArticleRequest,
): TE.TaskEither<HttpError<ApiError>, ArticleResponse> =>
  pipe(
    fetch(`${API_BASE}/articles/${encodeURIComponent(slug)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(request),
    }),
    fetchToTaskEither,
    TE.chainEitherK(decodeSuccess(ArticleResponseJson)),
    TE.mapLeft(decodeApiError),
  )

export const deleteArticle = (
  token: string,
  slug: string,
): TE.TaskEither<HttpError<ApiError>, true> =>
  pipe(
    fetch(`${API_BASE}/articles/${encodeURIComponent(slug)}`, {
      method: 'DELETE',
      headers: { Authorization: `Token ${token}` },
    }),
    fetchToTaskEither,
    TE.chainEitherK(ensureIsOk(true as const)),
    TE.mapLeft(decodeApiError),
  )

export const favoriteArticle = (
  token: string,
  slug: string,
): TE.TaskEither<HttpError<ApiError>, ArticleResponse> =>
  pipe(
    fetch(`${API_BASE}/articles/${encodeURIComponent(slug)}/favorite`, {
      method: 'POST',
      headers: { Authorization: `Token ${token}` },
    }),
    fetchToTaskEither,
    TE.chainEitherK(decodeSuccess(ArticleResponseJson)),
    TE.mapLeft(decodeApiError),
  )

export const unfavoriteArticle = (
  token: string,
  slug: string,
): TE.TaskEither<HttpError<ApiError>, ArticleResponse> =>
  pipe(
    fetch(`${API_BASE}/articles/${encodeURIComponent(slug)}/favorite`, {
      method: 'DELETE',
      headers: { Authorization: `Token ${token}` },
    }),
    fetchToTaskEither,
    TE.chainEitherK(decodeSuccess(ArticleResponseJson)),
    TE.mapLeft(decodeApiError),
  )
