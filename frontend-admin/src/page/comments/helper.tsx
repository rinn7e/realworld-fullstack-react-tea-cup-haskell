import * as RD from '@devexperts/remote-data-ts'
import type * as Pagination from '@rinn7e/tea-cup-pagination'
import * as O from 'fp-ts/lib/Option'
import * as TE from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/function'
import React from 'react'

import { getAdminComments } from '@/common/api/handler/comment'
import { type ApiError, type HttpError } from '@/common/api/type'
import type { Comment } from '@/common/api/type/comment'
import { renderPagination } from '@/component/pagination'
import { UserImage } from '@/component/user-image'
import type { Shared } from '@/type'

import { type CommentItemMsg, GET_COMMENTS_LIMIT, type Model } from './type'

export const mkPaginationConfig = (
  shared: Shared,
  model: Model,
): Pagination.Config<Comment, CommentItemMsg, HttpError<ApiError>> => ({
  limit: GET_COMMENTS_LIMIT,
  scrollContainerId: 'main-content',
  handler: (offset, limit) => {
    const searchText = model.searchBar.searchText.trim()
    const params: {
      limit: number
      offset: number
      author?: string
      articleSlug?: string
    } = { limit, offset }

    if (searchText) {
      if (searchText.startsWith('author:')) {
        params.author = searchText.slice(7).trim()
      } else if (searchText.startsWith('@')) {
        params.author = searchText.slice(1).trim()
      } else if (searchText.startsWith('article:')) {
        params.articleSlug = searchText.slice(8).trim()
      } else if (searchText.startsWith('slug:')) {
        params.articleSlug = searchText.slice(5).trim()
      } else {
        params.author = searchText
      }
    }

    return pipe(
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
            getAdminComments(token, {
              ...params,
              sort: model.searchBar.sort.attr,
              direction: model.searchBar.sort.direction,
            }),
            TE.map((res) => ({
              items: res.comments,
              totalCount: res.totalCount,
            })),
          ),
      ),
    )
  },
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
            Error loading comments:{' '}
            {err.err
              ? Object.entries(err.err.errors)
                  .map(([k, v]) => `${k}: ${v.join(', ')}`)
                  .join('; ')
              : `Connection error (Status ${err.statusCode}): ${err.actualErr || 'unknown'}`}
          </div>
        ),
        (comments) =>
          comments.length === 0 ? (
            <div className='py-[60px] text-center font-medium text-slate-500 dark:text-neutral-400'>
              No comments found.
            </div>
          ) : (
            <div className='dark:bg-surface-dark overflow-x-auto rounded-[12px] border border-slate-100 bg-white shadow-sm dark:border-white/10'>
              <table className='w-full border-collapse text-left'>
                <thead className='bg-slate-50 text-[12px] font-semibold tracking-wider text-slate-500 uppercase dark:bg-black/20 dark:text-slate-200'>
                  <tr>
                    <th className='px-[24px] py-[16px]'>ID</th>
                    <th className='px-[24px] py-[16px]'>Author</th>
                    <th className='px-[24px] py-[16px]'>Body</th>
                    <th className='px-[24px] py-[16px]'>Created At</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-slate-100 text-[14px] dark:divide-white/10'>
                  {comments.map((c) => (
                    <tr
                      key={c.id}
                      className='cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-white/5'
                      onClick={() =>
                        itemDispatch(c, {
                          _tag: 'SelectComment',
                          comment: O.some(c),
                        })
                      }
                    >
                      <td className='px-[24px] py-[16px] font-mono text-slate-400 dark:text-slate-200'>
                        {c.id}
                      </td>
                      <td className='text-theme-secondary flex items-center gap-[8px] px-[24px] py-[16px] font-medium dark:text-white'>
                        <UserImage
                          src={c.author.image}
                          className='h-[24px] w-[24px] rounded-full object-cover shadow-sm'
                        />
                        <span>{c.author.username}</span>
                      </td>
                      <td className='max-w-[400px] truncate px-[24px] py-[16px] text-slate-600 dark:text-slate-200'>
                        {c.body}
                      </td>
                      <td className='px-[24px] py-[16px] text-slate-400 dark:text-slate-200'>
                        {new Date(c.createdAt).toLocaleDateString()}
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
