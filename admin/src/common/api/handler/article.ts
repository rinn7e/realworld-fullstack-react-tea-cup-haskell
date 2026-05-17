import * as TE from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/function'

import { API_BASE } from '@/common/env'

import {
  type ArticleListResponse,
  ArticleListResponseJson,
  type ApiError,
  type HttpError,
} from '../type'
import {
  decodeApiError,
  decodeSuccess,
  ensureIsOk,
  fetchToTaskEither,
} from './common'

const hashSlugToId = (slug: string): number => {
  let hash = 0
  for (let i = 0; i < slug.length; i++) {
    hash = slug.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash)
}

export const getAdminArticles = (
  token: string,
  params: {
    limit?: number
    offset?: number
    tag?: string
    author?: string
    search?: string
  } = {},
): TE.TaskEither<HttpError<ApiError>, ArticleListResponse> => {
  const query = new URLSearchParams()
  if (params.limit !== undefined) query.set('limit', String(params.limit))
  if (params.offset !== undefined) query.set('offset', String(params.offset))
  if (params.tag !== undefined) query.set('tag', params.tag)
  if (params.author !== undefined) query.set('author', params.author)
  if (params.search !== undefined) query.set('search', params.search)
  const qs = query.toString()

  return pipe(
    fetch(`${API_BASE}/admin/articles${qs ? `?${qs}` : ''}`, {
      headers: { Authorization: `Token ${token}` },
    }),
    fetchToTaskEither,
    TE.chainEitherK(decodeSuccess(ArticleListResponseJson)),
    TE.map((res) => ({
      articlesCount: res.articlesCount,
      articles: res.articles.map((a) => ({
        ...a,
        id: a.id !== undefined ? a.id : hashSlugToId(a.slug),
      })),
    })),
    TE.mapLeft(decodeApiError),
  )
}

export const deleteArticle = (
  token: string,
  slug: string,
): TE.TaskEither<HttpError<ApiError>, true> =>
  pipe(
    fetch(`${API_BASE}/admin/articles/${encodeURIComponent(slug)}`, {
      method: 'DELETE',
      headers: { Authorization: `Token ${token}` },
    }),
    fetchToTaskEither,
    TE.chainEitherK(ensureIsOk(true as const)),
    TE.mapLeft(decodeApiError),
  )
