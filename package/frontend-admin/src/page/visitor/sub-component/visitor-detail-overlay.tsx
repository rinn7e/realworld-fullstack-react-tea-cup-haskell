import * as O from 'fp-ts/lib/Option'
import React from 'react'
import { type Dispatcher } from 'tea-cup-fp'

import { type Visitor } from '@/common/api/type/visitor'

import { type Msg } from '../type'
import { DetailRow } from './detail-row'

const FingerprintBreakdown: React.FC<{ fingerprint: string; ip: string; userAgent: string }> = ({
  fingerprint,
  ip,
  userAgent,
}) => (
  <div>
    <DetailRow label='Fingerprint' value={fingerprint || '-'} mono />
    <div className='mt-[10px] rounded-[10px] border border-slate-100 bg-slate-50 p-[16px] dark:border-white/10 dark:bg-black/20'>
      <div className='mb-[8px] text-[11px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-400'>
        How is this calculated?
      </div>
      <div className='font-mono text-[12px] text-slate-500 dark:text-slate-300'>
        SHA-256( IP &nbsp;<span className='text-slate-300 dark:text-slate-500'>|</span>&nbsp; User-Agent &nbsp;<span className='text-slate-300 dark:text-slate-500'>|</span>&nbsp; Accept-Language )
      </div>
      <div className='mt-[10px] grid grid-cols-1 gap-[6px]'>
        <div className='flex items-start gap-[8px] text-[12px]'>
          <span className='mt-[1px] shrink-0 rounded bg-blue-100 px-[6px] py-[1px] font-mono text-[11px] text-blue-600 dark:bg-blue-900/40 dark:text-blue-300'>IP</span>
          <span className='break-all text-slate-500 dark:text-slate-300'>{ip}</span>
        </div>
        <div className='flex items-start gap-[8px] text-[12px]'>
          <span className='mt-[1px] shrink-0 rounded bg-violet-100 px-[6px] py-[1px] font-mono text-[11px] text-violet-600 dark:bg-violet-900/40 dark:text-violet-300'>UA</span>
          <span className='break-all text-slate-500 dark:text-slate-300'>{userAgent}</span>
        </div>
      </div>
      <p className='mt-[10px] text-[11px] leading-relaxed text-slate-400 dark:text-slate-500'>
        Each unique combination of IP address, browser User-Agent, and Accept-Language header produces the same hash — identifying the same device across visits without storing personal data.
      </p>
    </div>
  </div>
)

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
        onClick={() => dispatch({ _tag: 'ClearSelected' })}
      />
      <div className='animate-in slide-in-from-right dark:bg-surface-dark fixed top-0 right-0 z-50 h-full w-full max-w-[50%] bg-white shadow-2xl duration-300'>
        <div className='flex h-full flex-col'>
          <div className='flex items-center justify-between border-b border-slate-100 p-[24px] dark:border-white/20'>
            <h3 className='text-theme-secondary text-[20px] font-bold dark:text-white'>
              Visitor Details
            </h3>
            <button
              type='button'
              onClick={() => dispatch({ _tag: 'ClearSelected' })}
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
          <div className='flex-grow overflow-y-auto p-[32px]'>
            <div className='mb-[32px]'>
              <div className='text-theme-secondary text-[24px] font-bold dark:text-white'>
                Visitor #{visitor.id}
              </div>
              <div className='text-slate-500 dark:text-slate-200'>
                {new Date(visitor.timestamp).toLocaleString()}
              </div>
            </div>

            <div className='grid grid-cols-1 gap-[24px]'>
              <DetailRow label='IP Address' value={visitor.ip} mono />
              <DetailRow label='Path' value={visitor.path} />
              <FingerprintBreakdown
                fingerprint={visitor.fingerprint}
                ip={visitor.ip}
                userAgent={visitor.userAgent}
              />
            </div>

            {visitor.user && (
              <div className='mt-[32px]'>
                <div className='mb-[16px] border-b border-slate-100 pb-[8px] text-[12px] font-bold tracking-wider text-slate-400 uppercase dark:border-white/10 dark:text-slate-200'>
                  Linked User
                </div>
                <div className='grid grid-cols-1 gap-[20px]'>
                  <DetailRow
                    label='User ID'
                    value={`#${visitor.user.id}`}
                    mono
                  />
                  <DetailRow
                    label='Username'
                    value={`@${visitor.user.username}`}
                  />
                  <DetailRow label='Email' value={visitor.user.email} />
                  <DetailRow label='Role' value={visitor.user.role} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
