import * as RD from '@devexperts/remote-data-ts'
import { attemptTE, resultToRd } from '@rinn7e/tea-cup-prelude'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import { Cmd } from 'tea-cup-fp'

import {
  getDashboardStats,
  getLogs,
  getVisitorStats,
} from '@/common/api/handler/dashboard'
import { type Shared } from '@/common/type/shared'

import { type Model, type Msg, type TimeFilter } from './type'

export const init = (shared: Shared): [Model, Cmd<Msg>] => {
  const currentFilter: TimeFilter = 'week'
  const model: Model = {
    _tag: 'HomeModel',
    stats: RD.pending,
    visitorStats: RD.pending,
    currentFilter,
    logs: RD.pending,
    selectedLog: O.none,
  }

  return [model, fetchAllCmd(shared, currentFilter)]
}

const fetchAllCmd = (shared: Shared, filter: TimeFilter): Cmd<Msg> =>
  pipe(
    shared.token,
    O.fold(
      () => Cmd.none(),
      (token) =>
        Cmd.batch([
          attemptTE(
            getDashboardStats(token),
            (result): Msg => ({
              _tag: 'StatsResult',
              result,
            }),
          ),
          attemptTE(
            getVisitorStats(token, filter),
            (result): Msg => ({
              _tag: 'VisitorStatsResult',
              result,
            }),
          ),
          attemptTE(
            getLogs(token, { limit: 10 }),
            (result): Msg => ({
              _tag: 'LogsResult',
              result: result.map((res) => res.logs),
            }),
          ),
        ]),
    ),
  )

export const update =
  (shared: Shared) =>
  (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
    switch (msg._tag) {
      case 'Refresh':
        return [
          {
            ...model,
            stats: RD.pending,
            visitorStats: RD.pending,
            logs: RD.pending,
          },
          fetchAllCmd(shared, model.currentFilter),
        ]
      case 'ChangeFilter':
        return changeFilterHandler(shared, msg.filter, model)
      case 'SelectLog':
        return [{ ...model, selectedLog: msg.log }, Cmd.none()]
      case 'StatsResult':
        return [{ ...model, stats: resultToRd(msg.result) }, Cmd.none()]
      case 'VisitorStatsResult':
        return [{ ...model, visitorStats: resultToRd(msg.result) }, Cmd.none()]
      case 'LogsResult':
        return [{ ...model, logs: resultToRd(msg.result) }, Cmd.none()]
      case 'NoOp':
        return [model, Cmd.none()]
    }
  }

const changeFilterHandler = (
  shared: Shared,
  filter: TimeFilter,
  model: Model,
): [Model, Cmd<Msg>] => {
  return [
    {
      ...model,
      currentFilter: filter,
      visitorStats: RD.pending,
    },
    pipe(
      shared.token,
      O.fold(
        () => Cmd.none(),
        (token) =>
          attemptTE(
            getVisitorStats(token, filter),
            (result): Msg => ({
              _tag: 'VisitorStatsResult',
              result,
            }),
          ),
      ),
    ),
  ]
}
