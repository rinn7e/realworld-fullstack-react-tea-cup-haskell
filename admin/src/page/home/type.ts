import { EqAlways } from '@rinn7e/tea-cup-prelude'
import * as A from 'fp-ts/lib/Array'
import * as EqClass from 'fp-ts/lib/Eq'
import * as O from 'fp-ts/lib/Option'
import * as N from 'fp-ts/lib/number'
import * as S from 'fp-ts/lib/string'
import { type Dispatcher } from 'tea-cup-fp'

export type TimeFilter = '24h' | 'week' | 'month' | 'year'

export const TimeFilterEq: EqClass.Eq<TimeFilter> = S.Eq as any

export type VisitorStat = {
  name: string
  visitors: number
}

export const VisitorStatEq = EqClass.struct<VisitorStat>({
  name: S.Eq,
  visitors: N.Eq,
})

export type ErrorLevel = 'error' | 'warning' | 'info'

export type ErrorLog = {
  id: number
  level: ErrorLevel
  message: string
  source: string
  timestamp: string
}

export const ErrorLogEq = EqClass.struct<ErrorLog>({
  id: N.Eq,
  level: S.Eq as any,
  message: S.Eq,
  source: S.Eq,
  timestamp: S.Eq,
})

export type Model = {
  readonly _tag: 'HomeModel'
  readonly articleCount: number
  readonly userCount: number
  readonly commentCount: number
  readonly visitorStats: VisitorStat[]
  readonly currentFilter: TimeFilter
  readonly errorLogs: ErrorLog[]
  readonly selectedLog: O.Option<ErrorLog>
}

export type Msg =
  | { readonly _tag: 'NoOp' }
  | { readonly _tag: 'ChangeFilter'; readonly filter: TimeFilter }
  | { readonly _tag: 'SelectLog'; readonly log: O.Option<ErrorLog> }

export const MsgEq: EqClass.Eq<Msg> = {
  equals: (a, b) => {
    if (a._tag !== b._tag) return false
    if (a._tag === 'ChangeFilter' && b._tag === 'ChangeFilter') {
      return a.filter === b.filter
    }
    if (a._tag === 'SelectLog' && b._tag === 'SelectLog') {
      return O.getEq(ErrorLogEq).equals(a.log, b.log)
    }
    return true // Both are NoOp
  },
}

export const ModelEq: EqClass.Eq<Model> = EqClass.struct({
  _tag: S.Eq,
  articleCount: N.Eq,
  userCount: N.Eq,
  commentCount: N.Eq,
  visitorStats: A.getEq(VisitorStatEq),
  currentFilter: TimeFilterEq,
  errorLogs: A.getEq(ErrorLogEq),
  selectedLog: O.getEq(ErrorLogEq),
})

export type Props = {
  model: Model
  dispatch: Dispatcher<Msg>
}

export const PropsEq: EqClass.Eq<Props> = EqClass.struct({
  model: ModelEq,
  dispatch: EqAlways,
})
