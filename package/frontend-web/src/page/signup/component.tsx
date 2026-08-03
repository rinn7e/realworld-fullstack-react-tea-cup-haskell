import * as RD from '@devexperts/remote-data-ts'
import { ButtonMemo as DsButtonMemo } from '@rinn7e/realworld-design-system/element/button/component'
import { FormItemMemo } from '@rinn7e/tea-cup-form/component'
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
            <DsButtonMemo
              type='submit'
              isFullWidth={true}
              isLoading={RD.isPending(model.requestRd)}
              children={() => 'Sign up'}
            />
          </div>
        </form>
      </div>
    </div>
  )
}

export const SignupPageMemo = memoStrategy(SignupPageComponent, PropsEq.equals)
