import * as RD from '@devexperts/remote-data-ts'
import type * as Pagination from '@rinn7e/tea-cup-pagination'
import * as O from 'fp-ts/lib/Option'
import * as TE from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/function'
import React from 'react'

import { getAdminArticles } from '@/common/api/handler/article'
import { type ApiError, type HttpError } from '@/common/api/type'
import type { Article } from '@/common/api/type/article'
import { renderPagination } from '@/component/pagination'
import type { Shared } from '@/type'

import { type ArticleItemMsg, GET_ARTICLES_LIMIT, type Model } from './type'

export const mkPaginationConfig = (
  shared: Shared,
  model: Model,
): Pagination.Config<Article, ArticleItemMsg, HttpError<ApiError>> => ({
  limit: GET_ARTICLES_LIMIT,
  scrollContainerId: 'main-content',
  handler: (offset, limit) => {
    const searchParams = {
      limit,
      offset,
      ...(model.searchBar.searchText.trim() && {
        search: model.searchBar.searchText.trim(),
      }),
      sort: model.searchBar.sort,
      direction: model.searchBar.direction,
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
            getAdminArticles(token, searchParams),
            TE.map((res) => ({
              items: res.articles,
              totalCount: res.articlesCount,
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
            <div className='py-[60px] text-center font-medium text-slate-500 dark:text-neutral-400'>
              No articles found.
            </div>
          ) : (
            <div className='dark:bg-surface-dark overflow-x-auto rounded-[12px] border border-slate-100 bg-white shadow-sm dark:border-white/10'>
              <table className='w-full border-collapse text-left'>
                <thead className='bg-slate-50 text-[12px] font-semibold tracking-wider text-slate-500 uppercase dark:bg-black/20 dark:text-slate-200'>
                  <tr>
                    <th className='px-[24px] py-[16px]'>ID</th>
                    <th className='px-[24px] py-[16px]'>Slug</th>
                    <th className='px-[24px] py-[16px]'>Title</th>
                    <th className='px-[24px] py-[16px]'>Author</th>
                    <th className='px-[24px] py-[16px] text-center'>
                      Favorites
                    </th>
                    <th className='px-[24px] py-[16px]'>Created At</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-slate-100 text-[14px] dark:divide-white/10'>
                  {articles.map((a) => (
                    <tr
                      key={a.id}
                      className='cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-white/5'
                      onClick={() =>
                        itemDispatch(a, {
                          _tag: 'SelectArticle',
                          article: O.some(a),
                        })
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
