import * as RD from '@devexperts/remote-data-ts'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import { Box, Text, useInput, useWindowSize } from 'ink'
import { type ReactElement, memo, useState } from 'react'
import { type Dispatcher } from 'tea-cup-fp'

import {
  type ApiError,
  type DashboardStats,
  type HttpError,
  type Log,
  type VisitorStat,
} from '@/common/api'
import { formatDateTime } from '@/common/util'
import { DetailPanelMemo } from '@/component/detail-panel/component'
import { KeyHintMemo } from '@/component/key-hint/component'
import { formatListError } from '@/component/list-state/util'
import { type Column, TableMemo } from '@/component/table/component'
import { type Model, type Msg, type TimeFilter } from '@/screen/home-screen'

const filters: TimeFilter[] = ['24h', 'week', 'month', 'year']

const logColumns: Column<Log>[] = [
  { label: 'Time', width: 16, value: (l) => formatDateTime(l.timestamp) },
  { label: 'Level', width: 8, value: (l) => l.level },
  { label: 'Source', width: 14, value: (l) => l.source },
  { label: 'Message', width: 44, value: (l) => l.message },
]

// One remote value: its view when loaded, else loading or the error
const remote = <A,>(
  rd: RD.RemoteData<HttpError<ApiError>, A>,
  view: (a: A) => ReactElement,
) =>
  pipe(
    rd,
    RD.fold(
      () => <Text dimColor>Loading...</Text>,
      () => <Text dimColor>Loading...</Text>,
      (error) => <Text color='red'>{formatListError(error)}</Text>,
      view,
    ),
  )

const statCards = (
  stats: DashboardStats,
): ReadonlyArray<readonly [string, number]> => [
  ['Users', stats.totalUsers],
  ['Articles', stats.totalArticles],
  ['Comments', stats.totalComments],
  ['Visitors', stats.totalVisitors],
  ['Active 24h', stats.activeUsers24h],
]

const StatsView = ({ stats }: { stats: DashboardStats }) => (
  <Box columnGap={2} flexWrap='wrap'>
    {statCards(stats).map(([label, value]) => (
      <Box key={label} borderStyle='round' paddingX={1} flexDirection='column'>
        <Text dimColor>{label}</Text>
        <Text bold color='cyan'>
          {value.toLocaleString()}
        </Text>
      </Box>
    ))}
  </Box>
)

// The visitors chart of the web as bars of blocks
const VisitorChart = ({ visitorStats }: { visitorStats: VisitorStat[] }) => {
  const max = Math.max(1, ...visitorStats.map((s) => s.visitors))
  return (
    <Box flexDirection='column'>
      {visitorStats.map((s) => (
        <Box key={s.name} columnGap={1}>
          <Box width={8} flexShrink={0}>
            <Text dimColor>{s.name}</Text>
          </Box>
          <Text color='cyan'>
            {'█'.repeat(Math.round((s.visitors / max) * 40))}
          </Text>
          <Text>{s.visitors}</Text>
        </Box>
      ))}
    </Box>
  )
}

export type HomeScreenProps = {
  model: Model
  dispatch: Dispatcher<Msg>
}

const HomeScreenComponent = ({ model, dispatch }: HomeScreenProps) => {
  const [cursor, setCursor] = useState(0)
  const { rows } = useWindowSize()
  const logs = RD.isSuccess(model.logs) ? model.logs.value : []
  const bars = RD.isSuccess(model.visitorStats)
    ? model.visitorStats.value.length
    : 1
  // What the screen shows besides the logs: the tabs, the stats, the chart
  // and the key hints, and the log picked when there is one
  const maxRows = rows - 19 - bars - (O.isSome(model.selectedLog) ? 10 : 0)
  const at = Math.min(cursor, Math.max(0, logs.length - 1))

  useInput((input, key) => {
    if (key.upArrow || input === 'k') {
      setCursor(Math.max(0, at - 1))
    } else if (key.downArrow || input === 'j') {
      setCursor(Math.min(logs.length - 1, at + 1))
    } else if (key.return && logs.length > 0) {
      dispatch({ _tag: 'SelectLog', log: O.some(logs[at]) })
    } else if (key.escape) {
      dispatch({ _tag: 'SelectLog', log: O.none })
    } else if (input === 'f') {
      const next = filters[(filters.indexOf(model.currentFilter) + 1) % 4]
      dispatch({ _tag: 'ChangeFilter', filter: next })
    }
  })

  return (
    <Box flexDirection='column' rowGap={1}>
      {remote(model.stats, (stats) => (
        <StatsView stats={stats} />
      ))}
      <Box flexDirection='column'>
        <Text bold>
          Visitors{' '}
          {filters.map((f) => (
            <Text
              key={f}
              inverse={f === model.currentFilter}
              dimColor={f !== model.currentFilter}
            >
              {` ${f} `}
            </Text>
          ))}
        </Text>
        {remote(model.visitorStats, (visitorStats) => (
          <VisitorChart visitorStats={visitorStats} />
        ))}
      </Box>
      <Box flexDirection='column'>
        <Text bold>Logs</Text>
        {remote(model.logs, (items) => (
          <Box flexDirection='column'>
            {items.length === 0 ? (
              <Text dimColor>No logs.</Text>
            ) : (
              <TableMemo
                items={items}
                columns={logColumns}
                cursor={at}
                maxRows={maxRows}
              />
            )}
          </Box>
        ))}
      </Box>
      {pipe(
        model.selectedLog,
        O.fold(
          () => null,
          (log) => (
            <DetailPanelMemo
              title={`Log ${log.id}`}
              rows={[
                ['Level', log.level],
                ['Source', log.source],
                ['Message', log.message],
                ['User', log.userId === null ? '' : String(log.userId)],
                ['Time', formatDateTime(log.timestamp)],
              ]}
            />
          ),
        ),
      )}
      <KeyHintMemo
        hints={[
          ['j/k', 'move'],
          ['enter', 'open'],
          ['f', 'time range'],
        ]}
      />
    </Box>
  )
}

export const HomeScreenMemo = memo(HomeScreenComponent)
