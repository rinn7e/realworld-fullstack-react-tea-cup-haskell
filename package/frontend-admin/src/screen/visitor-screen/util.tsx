import * as RD from '@devexperts/remote-data-ts'
import type * as Pagination from '@rinn7e/tea-cup-pagination'
import { pipe } from 'fp-ts/lib/function'

import { type ApiError, type HttpError, type Visitor } from '@core/common/api'
import { type Shared } from '@core/common/type/shared'
import {
  type Model,
  type VisitorItemMsg,
} from '@core/screen/visitor-screen/type'
import { mkPaginationConfig } from '@core/screen/visitor-screen/util'

import {
  ListEmptyMemo,
  ListErrorMemo,
  ListLoadingMemo,
} from '@/component/list-state/component'
import { PaginationNavMemo } from '@/component/pagination-nav/component'

import { VisitorTableMemo } from './sub-component/visitor-table'

// The pagination of the core (`mkPaginationConfig`) with the views of the
// web
export const mkPaginationViewConfig = (
  shared: Shared,
  model: Model,
): Pagination.Config<Visitor, VisitorItemMsg, HttpError<ApiError>> => ({
  ...mkPaginationConfig(shared, model),
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
