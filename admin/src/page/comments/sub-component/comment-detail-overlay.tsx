import * as O from 'fp-ts/lib/Option'
import React from 'react'
import { type Dispatcher } from 'tea-cup-fp'

import { type Comment } from '@/common/api/type/comment'

import { type Msg } from '../type'
import { DetailRow } from './detail-row'

export const CommentDetailOverlay: React.FC<{
  selectedComment: O.Option<Comment>
  dispatch: Dispatcher<Msg>
}> = ({ selectedComment, dispatch }) => {
  if (O.isNone(selectedComment)) return null

  const comment = selectedComment.value

  return (
    <>
      <div
        className='fixed inset-0 z-40 cursor-pointer bg-slate-900/20 backdrop-blur-[2px] dark:bg-black/50'
        onClick={() => dispatch({ _tag: 'SelectComment', comment: O.none })}
      />
      <div className='animate-in slide-in-from-right dark:bg-surface-dark fixed top-0 right-0 z-50 h-full w-full max-w-[50%] bg-white shadow-2xl duration-300'>
        <div className='flex h-full flex-col'>
          <div className='flex items-center justify-between border-b border-slate-100 p-[24px] dark:border-white/20'>
            <h3 className='text-theme-secondary text-[20px] font-bold dark:text-white'>
              Comment Details
            </h3>
            <button
              type='button'
              onClick={() =>
                dispatch({ _tag: 'SelectComment', comment: O.none })
              }
              className='rounded-full p-[8px] text-slate-400 hover:bg-slate-50 hover:text-slate-600 dark:text-slate-200 dark:hover:bg-white/5 dark:hover:text-white'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-[20px] w-[20px]'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          </div>
          <div className='flex-grow overflow-y-auto p-[24px]'>
            <div className='mb-[32px]'>
              <div className='mb-[4px] text-[12px] font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-200'>
                Author
              </div>
              <div className='flex items-center gap-[12px]'>
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.authorUsername}`}
                  className='h-[32px] w-[32px] rounded-full object-cover shadow-sm'
                  alt=''
                />
                <div className='text-theme-secondary font-bold dark:text-white'>
                  {comment.authorUsername}
                </div>
              </div>
            </div>

            <div className='mb-[32px]'>
              <div className='mb-[8px] text-[12px] font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-200'>
                Comment Message
              </div>
              <div className='rounded-[12px] border border-slate-100 bg-slate-50 p-[24px] text-[16px] leading-relaxed text-slate-700 shadow-inner dark:border-white/20 dark:bg-black/20 dark:text-slate-200'>
                {comment.body}
              </div>
            </div>

            <div className='grid grid-cols-2 gap-[24px]'>
              <DetailRow
                label='Comment ID'
                value={comment.id.toString()}
                mono
              />
              <DetailRow
                label='Created At'
                value={new Date(comment.createdAt).toLocaleString()}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
