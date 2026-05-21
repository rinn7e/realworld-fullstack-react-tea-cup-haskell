import * as RD from '@devexperts/remote-data-ts'
import type * as Pagination from '@rinn7e/tea-cup-pagination'
import * as O from 'fp-ts/lib/Option'
import * as TE from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/function'
import React from 'react'

import { getAdminUsers } from '@/common/api/handler/user'
import { type ApiError, type HttpError } from '@/common/api/type'
import { type AdminUser } from '@/common/api/type/user'
import { renderPagination } from '@/component/pagination'
import { UserImage } from '@/component/user-image'
import { type Shared } from '@/common/type/shared'

import { GET_USERS_LIMIT, type Model, type UserItemMsg } from './type'

const parsePrefix =
  (prefix: string, key: 'username' | 'email') =>
  (text: string): O.Option<{ username?: string; email?: string }> =>
    pipe(
      text,
      O.fromPredicate((s) => s.startsWith(prefix)),
      O.map((s) => {
        if (key === 'username') {
          return { username: s.slice(prefix.length).trim() }
        } else {
          return { email: s.slice(prefix.length).trim() }
        }
      }),
    )

const getSearchParams = (
  searchText: string,
): { username?: string; email?: string } =>
  pipe(
    searchText,
    O.fromPredicate((s) => s.length > 0),
    O.map((text) =>
      pipe(
        parsePrefix('username:', 'username')(text),
        O.alt(() => parsePrefix('@', 'username')(text)),
        O.alt(() => parsePrefix('email:', 'email')(text)),
        O.getOrElse((): { username?: string; email?: string } => ({
          username: text,
        })),
      ),
    ),
    O.getOrElse((): { username?: string; email?: string } => ({})),
  )

export const mkPaginationConfig = (
  shared: Shared,
  model: Model,
): Pagination.Config<AdminUser, UserItemMsg, HttpError<ApiError>> => ({
  limit: GET_USERS_LIMIT,
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
            getAdminUsers(token, {
              limit,
              offset,
              sort: model.searchBar.sort,
              direction: model.searchBar.direction,
              ...getSearchParams(model.searchBar.searchText.trim()),
            }),
            TE.map((res) => ({
              items: res.users,
              totalCount: res.totalCount,
            })),
          ),
      ),
    ),
  renderItems: (itemsRD, itemDispatch) => {
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
            Error loading users:{' '}
            {err.err
              ? Object.entries(err.err.errors)
                  .map(([k, v]) => `${k}: ${v.join(', ')}`)
                  .join('; ')
              : `Connection error (Status ${err.statusCode}): ${err.actualErr || 'unknown'}`}
          </div>
        ),
        (users) =>
          users.length === 0 ? (
            <div className='py-[60px] text-center font-medium text-slate-500 dark:text-neutral-400'>
              No users found.
            </div>
          ) : (
            <div className='dark:bg-surface-dark overflow-x-auto rounded-[12px] border border-slate-100 bg-white shadow-sm dark:border-white/10'>
              <table className='w-full border-collapse text-left'>
                <thead className='bg-slate-50 text-[12px] font-semibold tracking-wider text-slate-500 uppercase dark:bg-black/20 dark:text-slate-200'>
                  <tr>
                    <th className='px-[24px] py-[16px]'>ID</th>
                    <th className='px-[24px] py-[16px]'>Avatar</th>
                    <th className='px-[24px] py-[16px]'>Username</th>
                    <th className='px-[24px] py-[16px]'>Email</th>
                    <th className='px-[24px] py-[16px]'>Bio</th>
                    <th className='px-[24px] py-[16px]'>Role</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-slate-100 text-[14px] dark:divide-white/10'>
                  {users.map((u) => (
                    <tr
                      key={u.id}
                      className='cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-white/5'
                      onClick={() =>
                        itemDispatch(u, {
                          _tag: 'SelectUser',
                          user: O.some(u),
                        })
                      }
                    >
                      <td className='px-[24px] py-[16px] font-mono text-slate-400 dark:text-slate-200'>
                        {u.id}
                      </td>
                      <td className='px-[24px] py-[16px]'>
                        <UserImage
                          src={u.image}
                          className='h-[32px] w-[32px] rounded-full object-cover shadow-sm'
                        />
                      </td>
                      <td className='px-[24px] py-[16px] font-medium text-slate-800 dark:text-white'>
                        {u.username}
                      </td>
                      <td className='px-[24px] py-[16px] text-slate-600 dark:text-slate-200'>
                        {u.email}
                      </td>
                      <td className='max-w-[300px] truncate px-[24px] py-[16px] text-slate-400 dark:text-slate-200'>
                        {u.bio || '—'}
                      </td>
                      <td className='px-[24px] py-[16px]'>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            u.role === 'admin'
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                              : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          }`}
                        >
                          {u.role}
                        </span>
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
