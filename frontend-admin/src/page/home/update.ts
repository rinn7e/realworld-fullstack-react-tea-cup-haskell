import * as O from 'fp-ts/lib/Option'
import { Cmd } from 'tea-cup-fp'

import { mockArticles, mockComments, mockUsers } from '@/common/api/type/mock'

import {
  type ErrorLog,
  type Model,
  type Msg,
  type TimeFilter,
  type VisitorStat,
} from './type'

const getStatsForFilter = (filter: TimeFilter): VisitorStat[] => {
  switch (filter) {
    case '24h':
      return [
        { name: '00:00', visitors: 10 },
        { name: '04:00', visitors: 5 },
        { name: '08:00', visitors: 45 },
        { name: '12:00', visitors: 80 },
        { name: '16:00', visitors: 120 },
        { name: '20:00', visitors: 90 },
        { name: '23:59', visitors: 30 },
      ]
    case 'week':
      return [
        { name: 'Mon', visitors: 120 },
        { name: 'Tue', visitors: 150 },
        { name: 'Wed', visitors: 180 },
        { name: 'Thu', visitors: 140 },
        { name: 'Fri', visitors: 210 },
        { name: 'Sat', visitors: 250 },
        { name: 'Sun', visitors: 230 },
      ]
    case 'month':
      return [
        { name: 'Week 1', visitors: 800 },
        { name: 'Week 2', visitors: 950 },
        { name: 'Week 3', visitors: 1100 },
        { name: 'Week 4', visitors: 1050 },
      ]
    case 'year':
      return [
        { name: 'Jan', visitors: 3200 },
        { name: 'Feb', visitors: 3500 },
        { name: 'Mar', visitors: 4100 },
        { name: 'Apr', visitors: 3800 },
        { name: 'May', visitors: 4500 },
        { name: 'Jun', visitors: 4800 },
        { name: 'Jul', visitors: 5200 },
        { name: 'Aug', visitors: 5500 },
        { name: 'Sep', visitors: 5100 },
        { name: 'Oct', visitors: 5800 },
        { name: 'Nov', visitors: 6200 },
        { name: 'Dec', visitors: 6500 },
      ]
  }
}

const mockErrorLogs: ErrorLog[] = [
  {
    id: 1,
    level: 'error',
    message: 'Failed to fetch articles from backend',
    source: 'ArticlesService.hs:142',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: 2,
    level: 'warning',
    message: 'Slow response from database query',
    source: 'DB.Internal:89',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 3,
    level: 'info',
    message: 'New user registered: admin_rinne',
    source: 'AuthHandler.hs:22',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: 4,
    level: 'error',
    message:
      'Critical Database Exception: \n[DB_ERROR] Connection reset by peer at 10.0.4.12:5432\n  at Database.PostgreSQL.Simple.Internal.exec (src/Database/PostgreSQL/Simple/Internal.hs:412:12)\n  at Database.Persist.Sql.Raw.executeWith (src/Database/Persist/Sql/Raw.hs:82:17)\n  at DB.Schema.Article.fetchArticles (src/DB/Schema/Article.hs:156:5)\n  at API.Handler.Article.getArticles (src/API/Handler/Article.hs:42:19)\n  at Servant.Server.Internal.runHandler (src/Servant/Server/Internal.hs:124:5)\n  at Main.main (app/Main.hs:88:3)',
    source: 'DB.Internal:412',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
]

export const init = (): [Model, Cmd<Msg>] => {
  const currentFilter: TimeFilter = 'week'
  return [
    {
      _tag: 'HomeModel',
      articleCount: mockArticles.length,
      userCount: mockUsers.length,
      commentCount: mockComments.length,
      visitorStats: getStatsForFilter(currentFilter),
      currentFilter,
      errorLogs: mockErrorLogs,
      selectedLog: O.none,
    },
    Cmd.none(),
  ]
}

export const update = (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
  switch (msg._tag) {
    case 'ChangeFilter':
      return [
        {
          ...model,
          currentFilter: msg.filter,
          visitorStats: getStatsForFilter(msg.filter),
        },
        Cmd.none(),
      ]
    case 'SelectLog':
      return [{ ...model, selectedLog: msg.log }, Cmd.none()]
    case 'NoOp':
      return [model, Cmd.none()]
  }
}
