import * as RD from '@devexperts/remote-data-ts'
import { EqAlways } from '@rinn7e/tea-cup-prelude'
import * as A from 'fp-ts/lib/Array'
import * as EqClass from 'fp-ts/lib/Eq'
import * as O from 'fp-ts/lib/Option'
import * as S from 'fp-ts/lib/string'
import { type Dispatcher, type Result } from 'tea-cup-fp'

import {
  type ApiError,
  ApiErrorEq,
  type HttpError,
  getHttpErrorEq,
} from '@/common/api/type'
import {
  type DashboardStats,
  DashboardStatsEq,
  type Log,
  LogEq,
  type VisitorStat,
  VisitorStatEq,
} from '@/common/api/type/dashboard'
import { type Shared, SharedEq } from '@/common/type/shared'

export type TimeFilter = '24h' | 'week' | 'month' | 'year'

export const TimeFilterEq: EqClass.Eq<TimeFilter> = S.Eq as any

export type Model = {
  readonly _tag: 'HomeModel'
  readonly stats: RD.RemoteData<HttpError<ApiError>, DashboardStats>
  readonly visitorStats: RD.RemoteData<HttpError<ApiError>, VisitorStat[]>
  readonly currentFilter: TimeFilter
  readonly logs: RD.RemoteData<HttpError<ApiError>, Log[]>
  readonly selectedLog: O.Option<Log>
}

export type Msg =
  | { readonly _tag: 'NoOp' }
  | { readonly _tag: 'Refresh' }
  | { readonly _tag: 'ChangeFilter'; readonly filter: TimeFilter }
  | { readonly _tag: 'SelectLog'; readonly log: O.Option<Log> }
  | {
      readonly _tag: 'StatsResult'
      readonly result: Result<HttpError<ApiError>, DashboardStats>
    }
  | {
      readonly _tag: 'VisitorStatsResult'
      readonly result: Result<HttpError<ApiError>, VisitorStat[]>
    }
  | {
      readonly _tag: 'LogsResult'
      readonly result: Result<HttpError<ApiError>, Log[]>
    }

export const ModelEq: EqClass.Eq<Model> = EqClass.struct({
  _tag: S.Eq,
  stats: RD.getEq(getHttpErrorEq(ApiErrorEq), DashboardStatsEq),
  visitorStats: RD.getEq(getHttpErrorEq(ApiErrorEq), A.getEq(VisitorStatEq)),
  currentFilter: TimeFilterEq,
  logs: RD.getEq(getHttpErrorEq(ApiErrorEq), A.getEq(LogEq)),
  selectedLog: O.getEq(LogEq),
})

export type Props = {
  model: Model
  shared: Shared
  dispatch: Dispatcher<Msg>
}

export const PropsEq: EqClass.Eq<Props> = EqClass.struct({
  model: ModelEq,
  shared: SharedEq,
  dispatch: EqAlways,
})
