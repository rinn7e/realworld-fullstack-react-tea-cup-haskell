import * as RD from '@devexperts/remote-data-ts'
import { FormItemMemo } from '@rinn7e/tea-cup-form/lib/component'
import { cn } from '@rinn7e/tea-cup-prelude'
import { Loader2 } from 'lucide-react'
import React from 'react'

import type { AppRoute } from '@/common/type/route'
import { memoStrategy } from '@/common/util'
import { ErrorMessages } from '@/component/error-messages'
import { Link } from '@/component/link'

import {
  type Props,
  PropsEq,
  signupEmailField,
  signupPasswordField,
  signupUsernameField,
} from './type'

const SignupPageComponent = ({ model, dispatch }: Props) => {
  const loginRoute: AppRoute = { page: { _tag: 'LoginPage' } }

  return (
    <div
      className='flex min-h-full items-start justify-center px-[16px] pt-[64px] pb-[32px]'
      data-test='signup-page'
    >
      <div className='flex w-full max-w-[448px] flex-col gap-[24px]'>
        <div className='flex flex-col gap-[8px]'>
          <h1 className='text-center text-3xl font-bold text-gray-900'>
            Sign up
          </h1>
          <p className='text-center text-sm'>
            <Link route={loginRoute} className='text-green-600 hover:underline'>
              Have an account?
            </Link>
          </p>
        </div>

        <form
          className='flex flex-col gap-[24px]'
          autoComplete='off'
          onSubmit={(e) => {
            e.preventDefault()
            if (RD.isPending(model.requestRd)) {
              return
            }
            if (!model.isFormValid) {
              dispatch({ _tag: 'ShowAllValidation' })
              return
            }
            dispatch({ _tag: 'Submit' })
          }}
        >
          <fieldset
            className='flex flex-col gap-[0px]'
            disabled={RD.isPending(model.requestRd)}
          >
            <FormItemMemo
              field={signupUsernameField}
              model={model.form}
              dispatch={(msg) => dispatch({ _tag: 'FormMsg', subMsg: msg })}
            />
            <FormItemMemo
              field={signupEmailField}
              model={model.form}
              dispatch={(msg) => dispatch({ _tag: 'FormMsg', subMsg: msg })}
            />
            <FormItemMemo
              field={signupPasswordField}
              model={model.form}
              dispatch={(msg) => dispatch({ _tag: 'FormMsg', subMsg: msg })}
            />
          </fieldset>

          {RD.isFailure(model.requestRd) && (
            <ErrorMessages error={model.requestRd.error} />
          )}

          <div className='pt-[16px]'>
            <button
              className={cn(
                'relative flex w-full items-center justify-center rounded bg-green-600 px-[16px] py-[10px] text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-60',
                RD.isPending(model.requestRd) && 'pointer-events-none',
              )}
              type='submit'
            >
              <span
                className={cn(RD.isPending(model.requestRd) && 'opacity-0')}
              >
                Sign up
              </span>
              {RD.isPending(model.requestRd) && (
                <div className='absolute inset-0 flex items-center justify-center'>
                  <Loader2 className='h-4 w-4 animate-spin' />
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export const SignupPageMemo = memoStrategy(SignupPageComponent, PropsEq.equals)
