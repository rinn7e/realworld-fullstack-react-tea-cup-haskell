import { NullableEq } from '@rinn7e/tea-cup-prelude'
import * as D from 'fp-ts/lib/Date'
import * as EqClass from 'fp-ts/lib/Eq'
import * as N from 'fp-ts/lib/number'
import * as S from 'fp-ts/lib/string'
import * as t from 'io-ts'

import { DateJson } from '@/common/type/date'

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

export const DashboardStatsJson: t.Type<DashboardStats> = t.type({
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

export const VisitorStatJson: t.Type<VisitorStat> = t.type({
  name: t.string,
  visitors: t.number,
})

export const VisitorStatsListJson: t.Type<VisitorStat[]> =
  t.array(VisitorStatJson)

export type LogLevel = 'INFO' | 'WARNING' | 'ERROR' | 'DEBUG'

export const LogLevelJson: t.Type<LogLevel> = t.keyof({
  INFO: null,
  WARNING: null,
  ERROR: null,
  DEBUG: null,
})

export type Log = {
  id: number
  level: LogLevel
  message: string
  source: string
  timestamp: Date
  userId: number | null
}

export const LogEq: EqClass.Eq<Log> = EqClass.struct({
  id: N.Eq,
  level: S.Eq,
  message: S.Eq,
  source: S.Eq,
  timestamp: D.Eq,
  userId: NullableEq(N.Eq),
})

export const LogJson: t.Type<Log, unknown, unknown> = t.type({
  id: t.number,
  level: LogLevelJson,
  message: t.string,
  source: t.string,
  timestamp: DateJson,
  userId: t.union([t.number, t.null]),
})

export type LogListResponse = {
  logs: Log[]
  totalCount: number
}

export const LogListResponseJson: t.Type<LogListResponse, unknown, unknown> =
  t.type({
    logs: t.array(LogJson),
    totalCount: t.number,
  })
