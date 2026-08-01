import * as RD from '@devexperts/remote-data-ts'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import React from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { memoStrategy } from '@/common/util'

import { FilterButton } from './sub-component/filter-button'
import { LevelBadge } from './sub-component/level-badge'
import { LogDetailOverlay } from './sub-component/log-detail-overlay'
import { StatCard } from './sub-component/stat-card'
import { type Props, PropsEq } from './type'

const LoadingSpinner = () => (
  <div className='flex items-center justify-center py-[40px]'>
    <div className='border-theme-primary h-8 w-8 animate-spin rounded-full border-t-2 border-b-2'></div>
  </div>
)

export const HomePageComponent: React.FC<Props> = ({ model, dispatch }) => {
  return (
    <div className='relative flex flex-col gap-[32px]'>
      <div>
        <div className='mb-[24px] flex items-center justify-between'>
          <h2 className='text-theme-secondary text-[28px] font-bold dark:text-white'>
            Overview
          </h2>
          <button
            type='button'
            onClick={() => dispatch({ _tag: 'Refresh' })}
            className='flex cursor-pointer items-center gap-[8px] rounded-[8px] bg-slate-100 px-[12px] py-[8px] text-[13px] font-bold text-slate-600 transition-all hover:bg-slate-200 dark:bg-black/20 dark:text-slate-200 dark:hover:bg-black/40'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-[16px] w-[16px]'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.001 0 01-15.357-2m15.357 2H15'
              />
            </svg>
            Refresh
          </button>
        </div>
        {pipe(
          model.stats,
          RD.fold(
            () => <LoadingSpinner />,
            () => <LoadingSpinner />,
            (err) => (
              <div className='text-red-500'>
                Error loading stats: {err.actualErr || 'Unknown error'}
              </div>
            ),
            (stats) => (
              <div className='grid grid-cols-1 gap-[24px] sm:grid-cols-2 lg:grid-cols-5'>
                <StatCard
                  label='Total Users'
                  value={stats.totalUsers.toString()}
                  color='bg-indigo-500'
                />
                <StatCard
                  label='Total Articles'
                  value={stats.totalArticles.toString()}
                  color='bg-blue-500'
                />
                <StatCard
                  label='Total Comments'
                  value={stats.totalComments.toString()}
                  color='bg-purple-500'
                />
                <StatCard
                  label='Total Visitors'
                  value={stats.totalVisitors.toString()}
                  color='bg-orange-500'
                />
                <StatCard
                  label='Active Users (24h)'
                  value={stats.activeUsers24h.toString()}
                  color='bg-green-500'
                />
              </div>
            ),
          ),
        )}
      </div>

      <div className='dark:bg-surface-dark rounded-[16px] bg-white p-[24px] shadow-sm'>
        <div className='mb-[24px] flex flex-col justify-between gap-[16px] sm:flex-row sm:items-center'>
          <h3 className='text-theme-secondary text-[18px] font-bold dark:text-white'>
            Visitor Activity
          </h3>
          <div className='flex flex-wrap gap-[8px] rounded-[8px] bg-slate-100 p-[4px] dark:bg-black/20'>
            <FilterButton
              label='24h'
              active={model.currentFilter === '24h'}
              onClick={() => dispatch({ _tag: 'ChangeFilter', filter: '24h' })}
            />
            <FilterButton
              label='Week'
              active={model.currentFilter === 'week'}
              onClick={() => dispatch({ _tag: 'ChangeFilter', filter: 'week' })}
            />
            <FilterButton
              label='Month'
              active={model.currentFilter === 'month'}
              onClick={() =>
                dispatch({ _tag: 'ChangeFilter', filter: 'month' })
              }
            />
            <FilterButton
              label='Year'
              active={model.currentFilter === 'year'}
              onClick={() => dispatch({ _tag: 'ChangeFilter', filter: 'year' })}
            />
          </div>
        </div>

        <div className='h-[300px] w-full'>
          {pipe(
            model.visitorStats,
            RD.fold(
              () => <LoadingSpinner />,
              () => <LoadingSpinner />,
              (err) => (
                <div className='flex h-full items-center justify-center text-red-500'>
                  Error loading visitor activity:{' '}
                  {err.actualErr || 'Unknown error'}
                </div>
              ),
              (stats) => (
                <ResponsiveContainer width='100%' height='100%'>
                  <AreaChart data={stats}>
                    <defs>
                      <linearGradient
                        id='colorVisitors'
                        x1='0'
                        y1='0'
                        x2='0'
                        y2='1'
                      >
                        <stop
                          offset='5%'
                          stopColor='#3b82f6'
                          stopOpacity={0.1}
                        />
                        <stop
                          offset='95%'
                          stopColor='#3b82f6'
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray='3 3'
                      vertical={false}
                      stroke='#f1f5f9'
                    />
                    <XAxis
                      dataKey='name'
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'var(--color-chart-tick)', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'var(--color-chart-tick)', fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '8px',
                        border: 'none',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      }}
                    />
                    <Area
                      type='monotone'
                      dataKey='visitors'
                      stroke='#3b82f6'
                      strokeWidth={3}
                      fillOpacity={1}
                      fill='url(#colorVisitors)'
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ),
            ),
          )}
        </div>
      </div>

      <div className='dark:bg-surface-dark rounded-[16px] bg-white p-[24px] shadow-sm'>
        <h3 className='text-theme-secondary mb-[24px] text-[18px] font-bold dark:text-white'>
          System Logs
        </h3>
        {pipe(
          model.logs,
          RD.fold(
            () => <LoadingSpinner />,
            () => <LoadingSpinner />,
            (err) => (
              <div className='text-red-500'>
                Error loading logs: {err.actualErr || 'Unknown error'}
              </div>
            ),
            (logs) =>
              logs.length === 0 ? (
                <div className='py-8 text-center text-slate-500'>
                  No recent activity logs.
                </div>
              ) : (
                <div className='overflow-hidden rounded-[8px] border border-slate-100 dark:border-white/20'>
                  <table className='w-full text-left'>
                    <thead className='bg-slate-50 text-[12px] font-semibold tracking-wider text-slate-500 uppercase dark:bg-black/20 dark:text-slate-200'>
                      <tr>
                        <th className='px-[16px] py-[12px]'>Level</th>
                        <th className='px-[16px] py-[12px]'>Message</th>
                        <th className='px-[16px] py-[12px]'>Source</th>
                        <th className='px-[16px] py-[12px]'>Time</th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-slate-50 text-[14px] dark:divide-white/20'>
                      {logs.map((log) => (
                        <tr
                          key={log.id}
                          className='cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-white/5'
                          onClick={() =>
                            dispatch({ _tag: 'SelectLog', log: O.some(log) })
                          }
                        >
                          <td className='px-[16px] py-[12px]'>
                            <LevelBadge level={log.level} />
                          </td>
                          <td className='px-[16px] py-[12px] font-medium text-slate-700 dark:text-slate-200'>
                            <div className='max-w-[500px] truncate font-mono text-[12px]'>
                              {log.message}
                            </div>
                          </td>
                          <td className='px-[16px] py-[12px] font-mono text-[12px] text-slate-500 dark:text-slate-200'>
                            {log.source}
                          </td>
                          <td className='px-[16px] py-[12px] text-slate-400 dark:text-slate-200'>
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ),
          ),
        )}
      </div>

      <LogDetailOverlay selectedLog={model.selectedLog} dispatch={dispatch} />
    </div>
  )
}

export const HomePageMemo = memoStrategy(HomePageComponent, PropsEq.equals)
