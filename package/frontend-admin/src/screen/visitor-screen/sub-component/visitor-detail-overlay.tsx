import { EqAlways } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as O from 'fp-ts/lib/Option'
import * as S from 'fp-ts/lib/string'
import React, { memo } from 'react'
import { type Dispatcher } from 'tea-cup-fp'

import { type Visitor, VisitorEq } from '@/common/api'
import { DetailRowMemo } from '@/component/detail-row'

import { type Msg } from '../type'

export type FingerprintBreakdownProps = {
  fingerprint: string
  ip: string
  userAgent: string
}

const FingerprintBreakdownPropsEq: EqClass.Eq<FingerprintBreakdownProps> =
  EqClass.struct({
    fingerprint: S.Eq,
    ip: S.Eq,
    userAgent: S.Eq,
  })

const FingerprintBreakdownComponent = ({
  fingerprint,
  ip,
  userAgent,
}: FingerprintBreakdownProps) => (
  <div>
    <DetailRowMemo label='Fingerprint' value={fingerprint} isMono={true} />
    <div className='pt-[10px]'>
      <div className='rounded-[10px] border border-slate-100 bg-slate-50 p-[16px] dark:border-white/10 dark:bg-black/20'>
        <div className='pb-[8px] text-[11px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-400'>
          How is this calculated?
        </div>
        <div className='font-mono text-[12px] text-slate-500 dark:text-slate-300'>
          SHA-256( IP &nbsp;
          <span className='text-slate-300 dark:text-slate-500'>|</span>&nbsp;
          User-Agent &nbsp;
          <span className='text-slate-300 dark:text-slate-500'>|</span>&nbsp;
          Accept-Language )
        </div>
        <div className='grid grid-cols-1 gap-[6px] pt-[10px]'>
          <div className='flex items-start gap-[8px] text-[12px]'>
            <div className='shrink-0 pt-[1px]'>
              <span className='shrink-0 rounded bg-blue-100 px-[6px] py-[1px] font-mono text-[11px] text-blue-600 dark:bg-blue-900/40 dark:text-blue-300'>
                IP
              </span>
            </div>
            <span className='break-all text-slate-500 dark:text-slate-300'>
              {ip}
            </span>
          </div>
          <div className='flex items-start gap-[8px] text-[12px]'>
            <div className='shrink-0 pt-[1px]'>
              <span className='shrink-0 rounded bg-violet-100 px-[6px] py-[1px] font-mono text-[11px] text-violet-600 dark:bg-violet-900/40 dark:text-violet-300'>
                UA
              </span>
            </div>
            <span className='break-all text-slate-500 dark:text-slate-300'>
              {userAgent}
            </span>
          </div>
        </div>
        <p className='pt-[10px] text-[11px] leading-relaxed text-slate-400 dark:text-slate-500'>
          Each unique combination of IP address, browser User-Agent, and
          Accept-Language header produces the same hash — identifying the same
          device across visits without storing personal data.
        </p>
      </div>
    </div>
  </div>
)

export type VisitorDetailOverlayProps = {
  selectedVisitor: O.Option<Visitor>
  dispatch: Dispatcher<Msg>
}

const VisitorDetailOverlayPropsEq: EqClass.Eq<VisitorDetailOverlayProps> =
  EqClass.struct({
    selectedVisitor: O.getEq(VisitorEq),
    dispatch: EqAlways,
  })

const VisitorDetailOverlayComponent = ({
  selectedVisitor,
  dispatch,
}: VisitorDetailOverlayProps) => {
  if (O.isNone(selectedVisitor)) {
    return null
  } else {
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
              <div className='pb-[32px]'>
                <div className='text-theme-secondary text-[24px] font-bold dark:text-white'>
                  Visitor #{visitor.id}
                </div>
                <div className='text-slate-500 dark:text-slate-200'>
                  {visitor.timestamp.toLocaleString()}
                </div>
              </div>

              <div className='grid grid-cols-1 gap-[24px]'>
                <DetailRowMemo
                  label='IP Address'
                  value={visitor.ip}
                  isMono={true}
                />
                <DetailRowMemo
                  label='Path'
                  value={visitor.path}
                  isMono={false}
                />
                <FingerprintBreakdownMemo
                  fingerprint={visitor.fingerprint}
                  ip={visitor.ip}
                  userAgent={visitor.userAgent}
                />
              </div>

              {visitor.user && (
                <div className='pt-[32px]'>
                  <div className='pb-[16px]'>
                    <div className='border-b border-slate-100 pb-[8px] text-[12px] font-bold tracking-wider text-slate-400 uppercase dark:border-white/10 dark:text-slate-200'>
                      Linked User
                    </div>
                  </div>
                  <div className='grid grid-cols-1 gap-[20px]'>
                    <DetailRowMemo
                      label='User ID'
                      value={`#${visitor.user.id}`}
                      isMono={true}
                    />
                    <DetailRowMemo
                      label='Username'
                      value={`@${visitor.user.username}`}
                      isMono={false}
                    />
                    <DetailRowMemo
                      label='Email'
                      value={visitor.user.email}
                      isMono={false}
                    />
                    <DetailRowMemo
                      label='Role'
                      value={visitor.user.role}
                      isMono={false}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    )
  }
}

const FingerprintBreakdownMemo = memo(
  FingerprintBreakdownComponent,
  FingerprintBreakdownPropsEq.equals,
)

export const VisitorDetailOverlayMemo = memo(
  VisitorDetailOverlayComponent,
  VisitorDetailOverlayPropsEq.equals,
)
