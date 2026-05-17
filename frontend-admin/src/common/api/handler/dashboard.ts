import * as TE from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/function'

import { API_BASE } from '@/common/env'

import {
  type ApiError,
  type DashboardStats,
  DashboardStatsJson,
  type HttpError,
  type LogListResponse,
  LogListResponseJson,
  type VisitorListResponse,
  VisitorListResponseJson,
  type VisitorStat,
  VisitorStatsListJson,
} from '../type'
import { decodeApiError, decodeSuccess, fetchToTaskEither } from './common'

export const getDashboardStats = (
  token: string,
): TE.TaskEither<HttpError<ApiError>, DashboardStats> =>
  pipe(
    fetch(`${API_BASE}/admin/dashboard/stats`, {
      headers: { Authorization: `Token ${token}` },
    }),
    fetchToTaskEither,
    TE.chainEitherK(decodeSuccess(DashboardStatsJson)),
    TE.mapLeft(decodeApiError),
  )

export const getVisitorStats = (
  token: string,
  filter?: string,
): TE.TaskEither<HttpError<ApiError>, VisitorStat[]> => {
  const query = new URLSearchParams()
  if (filter !== undefined) query.set('filter', filter)
  const qs = query.toString()

  return pipe(
    fetch(`${API_BASE}/admin/dashboard/visitor-stats${qs ? `?${qs}` : ''}`, {
      headers: { Authorization: `Token ${token}` },
    }),
    fetchToTaskEither,
    TE.chainEitherK(decodeSuccess(VisitorStatsListJson)),
    TE.mapLeft(decodeApiError),
  )
}

export const getLogs = (
  token: string,
  params: {
    limit?: number
    offset?: number
  } = {},
): TE.TaskEither<HttpError<ApiError>, LogListResponse> => {
  const query = new URLSearchParams()
  if (params.limit !== undefined) query.set('limit', String(params.limit))
  if (params.offset !== undefined) query.set('offset', String(params.offset))
  const qs = query.toString()

  return pipe(
    fetch(`${API_BASE}/admin/logs${qs ? `?${qs}` : ''}`, {
      headers: { Authorization: `Token ${token}` },
    }),
    fetchToTaskEither,
    TE.chainEitherK(decodeSuccess(LogListResponseJson)),
    TE.mapLeft(decodeApiError),
  )
}

export const getVisitors = (
  token: string,
  params: {
    limit?: number
    offset?: number
    ip?: string
    path?: string
  } = {},
): TE.TaskEither<HttpError<ApiError>, VisitorListResponse> => {
  const query = new URLSearchParams()
  if (params.limit !== undefined) query.set('limit', String(params.limit))
  if (params.offset !== undefined) query.set('offset', String(params.offset))
  if (params.ip !== undefined) query.set('ip', params.ip)
  if (params.path !== undefined) query.set('path', params.path)
  const qs = query.toString()

  return pipe(
    fetch(`${API_BASE}/admin/visitors${qs ? `?${qs}` : ''}`, {
      headers: { Authorization: `Token ${token}` },
    }),
    fetchToTaskEither,
    TE.chainEitherK(decodeSuccess(VisitorListResponseJson)),
    TE.mapLeft(decodeApiError),
  )
}
