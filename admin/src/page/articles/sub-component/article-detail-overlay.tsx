import * as O from 'fp-ts/lib/Option'
import React from 'react'
import { type Dispatcher } from 'tea-cup-fp'

import { type Article } from '@/common/api/type/article'

import { type Msg } from '../type'
import { DetailRow } from './detail-row'

export const ArticleDetailOverlay: React.FC<{
  selectedArticle: O.Option<Article>
  dispatch: Dispatcher<Msg>
}> = ({ selectedArticle, dispatch }) => {
  if (O.isNone(selectedArticle)) return null

  const article = selectedArticle.value

  return (
    <>
      <div
        className='fixed inset-0 z-40 cursor-pointer bg-slate-900/20 backdrop-blur-[2px] dark:bg-black/50'
        onClick={() => dispatch({ _tag: 'SelectArticle', article: O.none })}
      />
      <div className='animate-in slide-in-from-right dark:bg-surface-dark fixed top-0 right-0 z-50 h-full w-full max-w-[50%] bg-white shadow-2xl duration-300'>
        <div className='flex h-full flex-col'>
          <div className='flex items-center justify-between border-b border-slate-100 p-[24px] dark:border-white/20'>
            <h3 className='text-theme-secondary text-[20px] font-bold dark:text-white'>
              Article Details
            </h3>
            <button
              type='button'
              onClick={() =>
                dispatch({ _tag: 'SelectArticle', article: O.none })
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
            <DetailRow label='Title' value={article.title} />
            <DetailRow label='Slug' value={article.slug} mono />
            <DetailRow label='Description' value={article.description} />
            <div className='mb-[24px]'>
              <div className='mb-[4px] text-[12px] font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-200'>
                Author
              </div>
              <div className='flex items-center gap-[12px]'>
                <img
                  src={article.author.image || ''}
                  className='h-[40px] w-[40px] rounded-full object-cover shadow-sm'
                  alt=''
                />
                <div>
                  <div className='text-theme-secondary font-bold dark:text-white'>
                    {article.author.username}
                  </div>
                  <div className='text-[12px] text-slate-400 dark:text-slate-200'>
                    {article.author.bio || 'No bio'}
                  </div>
                </div>
              </div>
            </div>
            <div className='mb-[24px]'>
              <div className='mb-[8px] text-[12px] font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-200'>
                Body Content
              </div>
              <div className='rounded-[12px] border border-slate-100 bg-slate-50 p-[20px] text-[14px] leading-relaxed text-slate-600 dark:border-white/20 dark:bg-black/20 dark:text-slate-200'>
                {article.body}
              </div>
            </div>
            <div className='flex gap-[24px]'>
              <DetailRow
                label='Favorites'
                value={article.favoritesCount.toString()}
              />
              <DetailRow
                label='Created'
                value={new Date(article.createdAt).toLocaleString()}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
