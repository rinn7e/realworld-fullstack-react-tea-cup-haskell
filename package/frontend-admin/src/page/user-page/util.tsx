import * as RD from '@devexperts/remote-data-ts'
import type * as Pagination from '@rinn7e/tea-cup-pagination'
import * as O from 'fp-ts/lib/Option'
import * as TE from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/function'

import {
  type AdminUser,
  type ApiError,
  type HttpError,
  getAdminUsers,
} from '@/common/api'
import { type Shared } from '@/common/type/shared'
import {
  ListEmptyMemo,
  ListErrorMemo,
  ListLoadingMemo,
} from '@/component/list-state/component'
import { PaginationNavMemo } from '@/component/pagination-nav/component'

import { UserTableMemo } from './sub-component/user-table'
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

export const getSearchParams = (
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
          TE.left<HttpError<ApiError>>({
            statusCode: 401,
            err: {
              errors: { body: ['Not authenticated'] },
            },
            actualErr: 'Not authenticated',
          }),
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
  renderItems: (itemsRd, itemDispatch) =>
    pipe(
      itemsRd,
      RD.fold(
        () => <ListLoadingMemo />,
        () => <ListLoadingMemo />,
        (error) => <ListErrorMemo entityLabel='users' error={error} />,
        (users) =>
          users.length === 0 ? (
            <ListEmptyMemo entityLabel='users' />
          ) : (
            <UserTableMemo users={users} itemDispatch={itemDispatch} />
          ),
      ),
    ),
  renderPagination: (currentPage, pageAmount, onPageChange) => (
    <PaginationNavMemo
      currentPage={currentPage}
      pageAmount={pageAmount}
      onPageChange={onPageChange}
    />
  ),
})
