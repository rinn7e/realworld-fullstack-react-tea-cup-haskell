import * as RD from '@devexperts/remote-data-ts'
import type * as Pagination from '@rinn7e/tea-cup-pagination'
import * as O from 'fp-ts/lib/Option'
import * as TE from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/function'

import {
  type ApiError,
  type HttpError,
  type Visitor,
  getVisitors,
} from '@/common/api'
import { type Shared } from '@/common/type/shared'
import {
  ListEmptyMemo,
  ListErrorMemo,
  ListLoadingMemo,
} from '@/component/list-state/component'
import { PaginationNavMemo } from '@/component/pagination-nav/component'

import { VisitorTableMemo } from './sub-component/visitor-table'
import { GET_VISITORS_LIMIT, type Model, type VisitorItemMsg } from './type'

export const getSearchParams = (
  searchText: string,
): { ip?: string; path?: string } => {
  const trimmed = searchText.trim()
  if (!trimmed) {
    return {}
  } else if (trimmed.startsWith('/')) {
    return { path: trimmed }
  } else {
    return { ip: trimmed }
  }
}

export const mkPaginationConfig = (
  shared: Shared,
  model: Model,
): Pagination.Config<Visitor, VisitorItemMsg, HttpError<ApiError>> => ({
  limit: GET_VISITORS_LIMIT,
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
  renderItems: (itemsRd, itemDispatch) =>
    pipe(
      itemsRd,
      RD.fold(
        () => <ListLoadingMemo />,
        () => <ListLoadingMemo />,
        (error) => <ListErrorMemo entityLabel='visitors' error={error} />,
        (visitors) =>
          visitors.length === 0 ? (
            <ListEmptyMemo entityLabel='visitors' />
          ) : (
            <VisitorTableMemo visitors={visitors} itemDispatch={itemDispatch} />
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
