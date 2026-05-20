import * as O from 'fp-ts/lib/Option'
import React from 'react'

import { memoStrategy } from '@/common/util'
import { SearchBar, type SearchOption } from '@/component/search-bar'

import { CommentDetailOverlay } from './sub-component/comment-detail-overlay'
import { type Props, PropsEq } from './type'

const sortOptions: SearchOption[] = [
  { label: 'Creation Date', value: 'createdAt' },
  { label: 'Author', value: 'author' },
  { label: 'ID', value: 'id' },
]

export const CommentsComponent: React.FC<Props> = ({ model, dispatch }) => {
  return (
    <div className='relative flex flex-col gap-[32px]'>
      <div className='flex flex-col gap-[24px]'>
        <h2 className='text-theme-secondary text-[28px] font-bold dark:text-white'>
          Comments
        </h2>
        <SearchBar
          searchText={model.searchText}
          sort={model.sort}
          sortOptions={sortOptions}
          onSearchChange={(text) =>
            dispatch({ _tag: 'ChangeSearchText', text })
          }
          onSortChange={(sort) => dispatch({ _tag: 'ChangeSort', sort })}
          placeholder='Search comments by author or message content...'
        />
      </div>

      <div className='dark:bg-surface-dark overflow-x-auto rounded-[12px] bg-white shadow-sm'>
        <table className='w-full text-left'>
          <thead className='bg-slate-50 text-[12px] font-semibold tracking-wider text-slate-500 uppercase dark:bg-black/20 dark:text-slate-200'>
            <tr>
              <th className='px-[24px] py-[16px]'>ID</th>
              <th className='px-[24px] py-[16px]'>Author</th>
              <th className='px-[24px] py-[16px]'>Body</th>
              <th className='px-[24px] py-[16px]'>Created At</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-slate-100 text-[14px] dark:divide-white/20'>
            {model.comments.map((c) => (
              <tr
                key={c.id}
                className='cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-white/5'
                onClick={() =>
                  dispatch({ _tag: 'SelectComment', comment: O.some(c) })
                }
              >
                <td className='px-[24px] py-[16px] font-mono text-slate-400 dark:text-slate-200'>
                  {c.id}
                </td>
                <td className='text-theme-secondary px-[24px] py-[16px] font-medium dark:text-white'>
                  {c.author.username}
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

      <CommentDetailOverlay
        selectedComment={model.selectedComment}
        dispatch={dispatch}
      />
    </div>
  )
}

export const CommentsMemo = memoStrategy(CommentsComponent, PropsEq.equals)
