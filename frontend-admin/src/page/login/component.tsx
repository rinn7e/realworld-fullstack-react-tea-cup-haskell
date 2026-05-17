import * as O from 'fp-ts/lib/Option'
import React from 'react'

import { memoStrategy } from '@/common/util'

import { type Props, PropsEq } from './type'

export const LoginComponent: React.FC<Props> = ({ model, dispatch }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!model.isSubmitting) {
      dispatch({ _tag: 'Submit' })
    }
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-slate-50 px-[16px] py-[40px] dark:bg-slate-950 transition-colors duration-300'>
      <div className='w-full max-w-[440px]'>
        {/* Decorative elements */}
        <div className='relative'>
          <div className='bg-theme-primary/10 absolute -top-[40px] -left-[40px] h-[120px] w-[120px] rounded-full blur-3xl dark:bg-theme-primary/5' />
          <div className='bg-theme-primary/10 absolute -right-[40px] -bottom-[40px] h-[120px] w-[120px] rounded-full blur-3xl dark:bg-theme-primary/5' />

          <form
            onSubmit={handleSubmit}
            className='dark:bg-surface-dark relative z-10 overflow-hidden rounded-[24px] border border-slate-100 bg-white p-[40px] shadow-xl dark:border-white/5 dark:bg-slate-900'
          >
            {/* Title / Brand */}
            <div className='mb-[36px] text-center'>
              <h2 className='text-theme-secondary mb-[8px] text-[28px] font-black tracking-tight dark:text-white'>
                Sentinel Admin
              </h2>
              <p className='text-[14px] text-slate-400 dark:text-slate-500'>
                Sign in to manage the RealWorld platform telemetry.
              </p>
            </div>

            {/* Error Alert Banner */}
            {O.isSome(model.error) && (
              <div className='animate-in fade-in slide-in-from-top-2 mb-[24px] flex items-start gap-[12px] rounded-[12px] border border-red-100 bg-red-50/50 p-[16px] text-[14px] text-red-600 dark:border-red-950/30 dark:bg-red-950/10 dark:text-red-400'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='mt-[2px] h-[16px] w-[16px] shrink-0'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                  />
                </svg>
                <div className='font-medium'>{model.error.value}</div>
              </div>
            )}

            {/* Form Inputs */}
            <div className='flex flex-col gap-[20px]'>
              <div>
                <label className='mb-[8px] block text-[12px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500'>
                  Email Address
                </label>
                <input
                  type='email'
                  required
                  disabled={model.isSubmitting}
                  value={model.email}
                  onChange={(e) =>
                    dispatch({ _tag: 'ChangeEmail', value: e.target.value })
                  }
                  placeholder='admin@realworld.io'
                  className='focus:border-theme-primary focus:ring-theme-primary/20 w-full rounded-[12px] border border-slate-200 bg-transparent px-[16px] py-[14px] text-[15px] transition-all focus:ring-4 focus:outline-none dark:border-white/10 dark:text-white dark:placeholder-slate-600'
                />
              </div>

              <div>
                <label className='mb-[8px] block text-[12px] font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500'>
                  Password
                </label>
                <input
                  type='password'
                  required
                  disabled={model.isSubmitting}
                  value={model.password}
                  onChange={(e) =>
                    dispatch({
                      _tag: 'ChangePassword',
                      value: e.target.value,
                    })
                  }
                  placeholder='••••••••'
                  className='focus:border-theme-primary focus:ring-theme-primary/20 w-full rounded-[12px] border border-slate-200 bg-transparent px-[16px] py-[14px] text-[15px] transition-all focus:ring-4 focus:outline-none dark:border-white/10 dark:text-white dark:placeholder-slate-600'
                />
              </div>

              <button
                type='submit'
                disabled={model.isSubmitting}
                className='bg-theme-primary hover:bg-theme-primary/95 focus:ring-theme-primary/20 mt-[8px] flex w-full items-center justify-center gap-[10px] rounded-[12px] py-[14px] text-[15px] font-bold text-white shadow-lg shadow-theme-primary/10 transition-all hover:shadow-theme-primary/20 focus:ring-4 disabled:opacity-50'
              >
                {model.isSubmitting ? (
                  <>
                    <svg
                      className='h-[18px] w-[18px] animate-spin text-white'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      />
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                      />
                    </svg>
                    Signing In...
                  </>
                ) : (
                  'Sign In to Dashboard'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export const LoginMemo = memoStrategy(LoginComponent, PropsEq.equals)
