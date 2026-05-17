import * as RD from '@devexperts/remote-data-ts'
import * as O from 'fp-ts/lib/Option'
import * as TE from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/function'
import React from 'react'

import { getAdminArticles } from '@/common/api/handler/article'
import type { Article } from '@/common/api/type/article'
import type { Shared } from '@/type'
import { type ApiError, type HttpError } from '@/common/api/type'
import type * as Pagination from '@rinn7e/tea-cup-pagination'
import { renderPagination } from '@/component/pagination'

import { GET_ARTICLES_LIMIT, type Model } from './type'

export const mkPaginationConfig = (
  shared: Shared,
  model: Model,
): Pagination.Config<Article, any, HttpError<ApiError>> => ({
  limit: GET_ARTICLES_LIMIT,
  scrollContainerId: 'main-content',
  handler: (offset, limit) => {
    const searchParams = model.searchText.trim()
      ? { limit, offset, search: model.searchText.trim() }
      : { limit, offset }

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
            getAdminArticles(token, searchParams),
            TE.map((res) => {
              const sortedArticles = [...res.articles].sort((a, b) => {
                const valA = a[model.sort.attr as keyof Article]
                const valB = b[model.sort.attr as keyof Article]
                if (valA === undefined || valB === undefined) return 0
                if (valA < valB) return model.sort.direction === 'asc' ? -1 : 1
                if (valA > valB) return model.sort.direction === 'asc' ? 1 : -1
                return 0
              })
              return {
                items: sortedArticles,
                totalCount: res.articlesCount,
              }
            }),
          ),
      ),
    )
  },
  renderItems: (itemsRD, itemDispatch) => {
    return pipe(
      itemsRD,
      RD.fold(
        () => (
          <div className='py-[60px] flex justify-center'>
            <div className='animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-theme-primary'></div>
          </div>
        ),
        () => (
          <div className='py-[60px] flex justify-center'>
            <div className='animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-theme-primary'></div>
          </div>
        ),
        (err) => (
          <div className='p-[24px] rounded-[12px] bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 font-semibold shadow-sm'>
            Error loading articles:{' '}
            {err.err
              ? Object.entries(err.err.errors)
                  .map(([k, v]) => `${k}: ${v.join(', ')}`)
                  .join('; ')
              : `Connection error (Status ${err.statusCode}): ${err.actualErr || 'unknown'}`}
          </div>
        ),
        (articles) =>
          articles.length === 0 ? (
            <div className='py-[60px] text-center text-slate-500 dark:text-neutral-400 font-medium'>
              No articles found.
            </div>
          ) : (
            <div className='dark:bg-surface-dark overflow-x-auto rounded-[12px] bg-white shadow-sm border border-slate-100 dark:border-white/10'>
              <table className='w-full text-left border-collapse'>
                <thead className='bg-slate-50 text-[12px] font-semibold tracking-wider text-slate-500 uppercase dark:bg-black/20 dark:text-slate-200'>
                  <tr>
                    <th className='px-[24px] py-[16px]'>ID</th>
                    <th className='px-[24px] py-[16px]'>Slug</th>
                    <th className='px-[24px] py-[16px]'>Title</th>
                    <th className='px-[24px] py-[16px]'>Author</th>
                    <th className='px-[24px] py-[16px] text-center'>Favorites</th>
                    <th className='px-[24px] py-[16px]'>Created At</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-slate-100 text-[14px] dark:divide-white/10'>
                  {articles.map((a) => (
                    <tr
                      key={a.id}
                      className='cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-white/5'
                      onClick={() =>
                        itemDispatch(a, { _tag: 'SelectArticle', article: O.some(a) })
                      }
                    >
                      <td className='px-[24px] py-[16px] font-mono text-slate-400 dark:text-slate-300'>
                        {a.id}
                      </td>
                      <td className='px-[24px] py-[16px] font-mono text-[12px] text-slate-500 dark:text-slate-300'>
                        {a.slug}
                      </td>
                      <td className='text-theme-secondary px-[24px] py-[16px] font-semibold dark:text-white'>
                        {a.title}
                      </td>
                      <td className='px-[24px] py-[16px] text-slate-600 dark:text-slate-300'>
                        {a.author.username}
                      </td>
                      <td className='px-[24px] py-[16px] text-center'>
                        <span className='rounded-full bg-slate-50 px-[10px] py-[4px] text-[12px] font-bold text-slate-500 dark:bg-white/10 dark:text-slate-300'>
                          {a.favoritesCount}
                        </span>
                      </td>
                      <td className='px-[24px] py-[16px] text-slate-400 dark:text-slate-300'>
                        {new Date(a.createdAt).toLocaleDateString()}
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
