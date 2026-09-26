import { EqAlways } from '@rinn7e/tea-cup-prelude'
import * as A from 'fp-ts/lib/Array'
import * as EqClass from 'fp-ts/lib/Eq'
import * as O from 'fp-ts/lib/Option'
import { memo } from 'react'

import { type Comment, CommentEq } from '@/common/api'
import { ProfileThumbnailMemo } from '@/component/profile-thumbnail'

import type { CommentItemMsg } from '../type'

export type CommentTableProps = {
  comments: Comment[]
  itemDispatch: (item: Comment, msg: CommentItemMsg) => void
}

const CommentTablePropsEq: EqClass.Eq<CommentTableProps> = EqClass.struct({
  comments: A.getEq(CommentEq),
  itemDispatch: EqAlways,
})

const CommentTableComponent = ({
  comments,
  itemDispatch,
}: CommentTableProps) => (
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
              <ProfileThumbnailMemo
                src={c.author.image}
                className='h-[24px] w-[24px] rounded-full object-cover shadow-sm'
              />
              <span>{c.author.username}</span>
            </td>
            <td className='max-w-[400px] truncate px-[24px] py-[16px] text-slate-600 dark:text-slate-200'>
              {c.body}
            </td>
            <td className='px-[24px] py-[16px] text-slate-400 dark:text-slate-200'>
              {c.createdAt.toLocaleDateString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

export const CommentTableMemo = memo(
  CommentTableComponent,
  CommentTablePropsEq.equals,
)
