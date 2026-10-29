import * as RD from '@devexperts/remote-data-ts'
import type * as Pagination from '@rinn7e/tea-cup-pagination'
import { pipe } from 'fp-ts/lib/function'

import { type ApiError, type Comment, type HttpError } from '@core/common/api'
import type { Shared } from '@core/common/type/shared'
import {
  type CommentItemMsg,
  type Model,
} from '@core/screen/comment-screen/type'
import { mkPaginationConfig } from '@core/screen/comment-screen/util'

import {
  ListEmptyMemo,
  ListErrorMemo,
  ListLoadingMemo,
} from '@/component/list-state/component'
import { PaginationNavMemo } from '@/component/pagination-nav/component'

import { CommentTableMemo } from './sub-component/comment-table'

// The pagination of the core (`mkPaginationConfig`) with the views of the
// web
export const mkPaginationViewConfig = (
  shared: Shared,
  model: Model,
): Pagination.Config<Comment, CommentItemMsg, HttpError<ApiError>> => ({
  ...mkPaginationConfig(shared, model),
  renderItems: (itemsRd, itemDispatch) =>
    pipe(
      itemsRd,
      RD.fold(
        () => <ListLoadingMemo />,
        () => <ListLoadingMemo />,
        (error) => <ListErrorMemo entityLabel='comments' error={error} />,
        (comments) =>
          comments.length === 0 ? (
            <ListEmptyMemo entityLabel='comments' />
          ) : (
            <CommentTableMemo comments={comments} itemDispatch={itemDispatch} />
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
