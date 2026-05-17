import * as O from 'fp-ts/lib/Option'
import React from 'react'
import { type Dispatcher } from 'tea-cup-fp'

import { type Visitor } from '@/common/api/type/visitor'

import { type Msg } from '../type'
import { DetailRow } from './detail-row'

export const VisitorDetailOverlay: React.FC<{
  selectedVisitor: O.Option<Visitor>
  dispatch: Dispatcher<Msg>
}> = ({ selectedVisitor, dispatch }) => {
  if (O.isNone(selectedVisitor)) return null

  const visitor = selectedVisitor.value

  return (
    <>
      <div
        className='fixed inset-0 z-40 cursor-pointer bg-slate-900/20 backdrop-blur-[2px] dark:bg-black/50'
        onClick={() => dispatch({ _tag: 'SelectVisitor', visitor: O.none })}
      />
      <div className='animate-in slide-in-from-right dark:bg-surface-dark fixed top-0 right-0 z-50 h-full w-full max-w-[50%] bg-white shadow-2xl duration-300'>
        <div className='flex h-full flex-col'>
          <div className='flex items-center justify-between border-b border-slate-100 p-[24px] dark:border-white/20'>
            <h3 className='text-theme-secondary text-[20px] font-bold dark:text-white'>
              Visitor Details
            </h3>
            <button
              type='button'
              onClick={() =>
                dispatch({ _tag: 'SelectVisitor', visitor: O.none })
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
            <DetailRow label='Internal ID' value={visitor.id.toString()} mono />
            <DetailRow label='IP Address' value={visitor.ip} />
            <DetailRow label='Requested Path' value={visitor.path} mono />
            <DetailRow
              label='Visited At'
              value={new Date(visitor.timestamp).toLocaleString()}
            />
            <div className='mt-[24px]'>
              <div className='mb-[8px] text-[12px] font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-200'>
                User Agent
              </div>
              <div className='rounded-[8px] bg-slate-50 p-[16px] font-mono text-[12px] leading-relaxed text-slate-600 dark:bg-black/20 dark:text-slate-200'>
                {visitor.userAgent || 'No User Agent recorded'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
