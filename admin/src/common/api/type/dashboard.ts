import { NullableEq } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as N from 'fp-ts/lib/number'
import * as S from 'fp-ts/lib/string'
import * as t from 'io-ts'

export type DashboardStats = {
  totalUsers: number
  totalArticles: number
  totalComments: number
  totalVisitors: number
  activeUsers24h: number
}

export const DashboardStatsEq: EqClass.Eq<DashboardStats> = EqClass.struct({
  totalUsers: N.Eq,
  totalArticles: N.Eq,
  totalComments: N.Eq,
  totalVisitors: N.Eq,
  activeUsers24h: N.Eq,
})

export const DashboardStatsJson = t.type({
  totalUsers: t.number,
  totalArticles: t.number,
  totalComments: t.number,
  totalVisitors: t.number,
  activeUsers24h: t.number,
})

export type VisitorStat = {
  name: string
  visitors: number
}

export const VisitorStatEq: EqClass.Eq<VisitorStat> = EqClass.struct({
  name: S.Eq,
  visitors: N.Eq,
})

export const VisitorStatJson = t.type({
  name: t.string,
  visitors: t.number,
})

export const VisitorStatsListJson = t.array(VisitorStatJson)

export type Log = {
  id: number
  level: string
  message: string
  source: string
  timestamp: string
  userId: number | null
}

export const LogEq: EqClass.Eq<Log> = EqClass.struct({
  id: N.Eq,
  level: S.Eq,
  message: S.Eq,
  source: S.Eq,
  timestamp: S.Eq,
  userId: NullableEq(N.Eq),
})

export const LogJson = t.type({
  id: t.number,
  level: t.string,
  message: t.string,
  source: t.string,
  timestamp: t.string,
  userId: t.union([t.number, t.null]),
})

export type LogListResponse = {
  logs: Log[]
  totalCount: number
}

export const LogListResponseJson = t.type({
  logs: t.array(LogJson),
  totalCount: t.number,
})
