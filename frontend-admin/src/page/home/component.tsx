import * as O from 'fp-ts/lib/Option'
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

export const HomeComponent: React.FC<Props> = ({ model, dispatch }) => {
  return (
    <div className='relative flex flex-col gap-[32px]'>
      <div>
        <h2 className='text-theme-secondary mb-[24px] text-[28px] font-bold dark:text-white'>
          Overview
        </h2>
        <div className='grid grid-cols-1 gap-[24px] md:grid-cols-3'>
          <StatCard
            label='Total Articles'
            value={model.articleCount.toString()}
            color='bg-blue-500'
          />
          <StatCard
            label='Active Users'
            value={model.userCount.toString()}
            color='bg-green-500'
          />
          <StatCard
            label='New Comments'
            value={model.commentCount.toString()}
            color='bg-purple-500'
          />
        </div>
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
          <ResponsiveContainer width='100%' height='100%'>
            <AreaChart data={model.visitorStats}>
              <defs>
                <linearGradient id='colorVisitors' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor='#3b82f6' stopOpacity={0.1} />
                  <stop offset='95%' stopColor='#3b82f6' stopOpacity={0} />
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
        </div>
      </div>

      <div className='dark:bg-surface-dark rounded-[16px] bg-white p-[24px] shadow-sm'>
        <h3 className='text-theme-secondary mb-[24px] text-[18px] font-bold dark:text-white'>
          System Logs
        </h3>
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
              {model.errorLogs.map((log) => (
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
      </div>

      <LogDetailOverlay selectedLog={model.selectedLog} dispatch={dispatch} />
    </div>
  )
}

export const HomeMemo = memoStrategy(HomeComponent, PropsEq.equals)
