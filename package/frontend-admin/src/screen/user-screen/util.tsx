import * as RD from '@devexperts/remote-data-ts'
import type * as Pagination from '@rinn7e/tea-cup-pagination'
import { pipe } from 'fp-ts/lib/function'

import { type AdminUser, type ApiError, type HttpError } from '@core/common/api'
import { type Shared } from '@core/common/type/shared'
import { type Model, type UserItemMsg } from '@core/screen/user-screen/type'
import { mkPaginationConfig } from '@core/screen/user-screen/util'

import {
  ListEmptyMemo,
  ListErrorMemo,
  ListLoadingMemo,
} from '@/component/list-state/component'
import { PaginationNavMemo } from '@/component/pagination-nav/component'

import { UserTableMemo } from './sub-component/user-table'

// The pagination of the core (`mkPaginationConfig`) with the views of the
// web
export const mkPaginationViewConfig = (
  shared: Shared,
  model: Model,
): Pagination.Config<AdminUser, UserItemMsg, HttpError<ApiError>> => ({
  ...mkPaginationConfig(shared, model),
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
