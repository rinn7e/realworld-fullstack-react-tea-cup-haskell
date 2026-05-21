import * as RD from '@devexperts/remote-data-ts'
import type * as Pagination from '@rinn7e/tea-cup-pagination'
import * as O from 'fp-ts/lib/Option'
import * as TE from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/function'
import React from 'react'

import { getVisitors } from '@/common/api/handler/dashboard'
import { type ApiError, type HttpError } from '@/common/api/type'
import { type Visitor } from '@/common/api/type/visitor'
import { renderPagination } from '@/component/pagination'
import { type Shared } from '@/common/type/shared'

import { GET_VISITORS_LIMIT, type Model } from './type'

const getSearchParams = (
  searchText: string,
): { ip?: string; path?: string } => {
  const trimmed = searchText.trim()
  if (!trimmed) return {}
  if (trimmed.startsWith('/')) {
    return { path: trimmed }
  }
  return { ip: trimmed }
}

export const mkPaginationConfig = (
  shared: Shared,
  model: Model,
): Pagination.Config<Visitor, void, HttpError<ApiError>> => ({
  limit: GET_VISITORS_LIMIT,
  scrollContainerId: 'main-content',
  handler: (offset, limit) =>
    pipe(
      shared.token,
      O.fold(
        () =>
          TE.left({
            _tag: 'HttpError',
            error: {
              _tag: 'ApiError',
              errors: { body: ['Not authenticated'] },
            },
          } as any),
        (token) =>
          pipe(
            getVisitors(token, {
              limit,
              offset,
              ...getSearchParams(model.searchBar.searchText),
            }),
            TE.map((res) => ({
              items: res.visitors,
              totalCount: res.totalCount,
            })),
          ),
      ),
    ),
  renderItems: (itemsRD, _) => {
    return pipe(
      itemsRD,
      RD.fold(
        () => (
          <div className='flex justify-center py-[60px]'>
            <div className='border-theme-primary h-10 w-10 animate-spin rounded-full border-t-2 border-b-2'></div>
          </div>
        ),
        () => (
          <div className='flex justify-center py-[60px]'>
            <div className='border-theme-primary h-10 w-10 animate-spin rounded-full border-t-2 border-b-2'></div>
          </div>
        ),
        (err) => (
          <div className='rounded-[12px] bg-red-50 p-[24px] font-semibold text-red-600 shadow-sm dark:bg-red-950/20 dark:text-red-400'>
            Error loading visitors:{' '}
            {err.err
              ? Object.entries(err.err.errors)
                  .map(([k, v]) => `${k}: ${v.join(', ')}`)
                  .join('; ')
              : `Connection error (Status ${err.statusCode}): ${err.actualErr || 'unknown'}`}
          </div>
        ),
        (visitors) =>
          visitors.length === 0 ? (
            <div className='py-[60px] text-center font-medium text-slate-500 dark:text-neutral-400'>
              No visitors found.
            </div>
          ) : (
            <div className='dark:bg-surface-dark overflow-x-auto rounded-[12px] border border-slate-100 bg-white shadow-sm dark:border-white/10'>
              <table className='w-full border-collapse text-left'>
                <thead className='bg-slate-50 text-[12px] font-semibold tracking-wider text-slate-500 uppercase dark:bg-black/20 dark:text-slate-200'>
                  <tr>
                    <th className='px-[24px] py-[16px]'>ID</th>
                    <th className='px-[24px] py-[16px]'>IP Address</th>
                    <th className='px-[24px] py-[16px]'>Path</th>
                    <th className='px-[24px] py-[16px]'>User Agent</th>
                    <th className='px-[24px] py-[16px]'>Visited At</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-slate-100 text-[14px] dark:divide-white/10'>
                  {visitors.map((v) => (
                    <tr
                      key={v.id}
                      className='cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-white/5'
                    >
                      <td className='px-[24px] py-[16px] font-mono text-slate-400 dark:text-slate-200'>
                        {v.id}
                      </td>
                      <td className='text-theme-secondary px-[24px] py-[16px] font-medium dark:text-white'>
                        {v.ip}
                      </td>
                      <td className='px-[24px] py-[16px] font-mono text-[12px] text-slate-500 dark:text-slate-200'>
                        {v.path}
                      </td>
                      <td className='max-w-[300px] truncate px-[24px] py-[16px] text-slate-600 dark:text-slate-200'>
                        {v.userAgent}
                      </td>
                      <td className='px-[24px] py-[16px] text-slate-400 dark:text-slate-200'>
                        {new Date(v.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ),
      ),
    )
  },
  renderPagination,
})
