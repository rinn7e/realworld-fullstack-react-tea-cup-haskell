import * as RD from '@devexperts/remote-data-ts'
import type * as Pagination from '@rinn7e/tea-cup-pagination'
import * as O from 'fp-ts/lib/Option'
import * as TE from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/function'

import {
  type ApiError,
  type Comment,
  type HttpError,
  getAdminComments,
} from '@/common/api'
import type { Shared } from '@/common/type/shared'
import {
  ListEmptyMemo,
  ListErrorMemo,
  ListLoadingMemo,
} from '@/component/list-state/component'
import { PaginationNavMemo } from '@/component/pagination-nav/component'

import { CommentTableMemo } from './sub-component/comment-table'
import { type CommentItemMsg, GET_COMMENTS_LIMIT, type Model } from './type'

const parsePrefix =
  (prefix: string, key: 'author' | 'articleSlug') =>
  (text: string): O.Option<{ author?: string; articleSlug?: string }> =>
    pipe(
      text,
      O.fromPredicate((s) => s.startsWith(prefix)),
      O.map((s) => {
        if (key === 'author') {
          return { author: s.slice(prefix.length).trim() }
        } else {
          return { articleSlug: s.slice(prefix.length).trim() }
        }
      }),
    )

export const getSearchParams = (
  searchText: string,
): { author?: string; articleSlug?: string } =>
  pipe(
    searchText,
    O.fromPredicate((s) => s.length > 0),
    O.map((text) =>
      pipe(
        parsePrefix('author:', 'author')(text),
        O.alt(() => parsePrefix('@', 'author')(text)),
        O.alt(() => parsePrefix('article:', 'articleSlug')(text)),
        O.alt(() => parsePrefix('slug:', 'articleSlug')(text)),
        O.getOrElse((): { author?: string; articleSlug?: string } => ({
          author: text,
        })),
      ),
    ),
    O.getOrElse((): { author?: string; articleSlug?: string } => ({})),
  )

export const mkPaginationConfig = (
  shared: Shared,
  model: Model,
): Pagination.Config<Comment, CommentItemMsg, HttpError<ApiError>> => ({
  limit: GET_COMMENTS_LIMIT,
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
            getAdminComments(token, {
              limit,
              offset,
              sort: model.searchBar.sort,
              direction: model.searchBar.direction,
              ...getSearchParams(model.searchBar.searchText.trim()),
            }),
            TE.map((res) => ({
              items: res.comments,
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
