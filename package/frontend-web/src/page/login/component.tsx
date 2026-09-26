import * as RD from '@devexperts/remote-data-ts'
import { ButtonMemo as DsButtonMemo } from '@rinn7e/realworld-design-system/element/button/component'
import { FormItemMemo } from '@rinn7e/tea-cup-form/component'
import React, { memo } from 'react'

import type { AppRoute } from '@/common/type/route'
import { ErrorMessagesMemo } from '@/component/error-messages/component'
import { Link } from '@/component/link'

import {
  type Props,
  PropsEq,
  loginEmailField,
  loginPasswordField,
} from './type'

const LoginPageComponent = ({ model, dispatch }: Props) => {
  const signupRoute: AppRoute = { page: { _tag: 'SignupPage' } }

  return (
    <div
      className='flex min-h-full items-start justify-center px-[16px] pt-[64px] pb-[32px]'
      data-test='login-page'
    >
      <div className='flex w-full max-w-[448px] flex-col gap-[24px]'>
        <div className='flex flex-col gap-[8px]'>
          <h1 className='text-center text-3xl font-bold text-gray-900 dark:text-zinc-100'>
            Sign in
          </h1>
          <p className='text-center text-sm'>
            <Link
              route={signupRoute}
              className='text-green-600 hover:underline'
            >
              Need an account?
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
            } else if (!model.isFormValid) {
              dispatch({ _tag: 'ShowAllValidation' })
            } else {
              dispatch({ _tag: 'Submit' })
            }
          }}
        >
          <fieldset
            className='flex flex-col gap-[0px]'
            disabled={RD.isPending(model.requestRd)}
          >
            <FormItemMemo
              field={loginEmailField}
              model={model.form}
              dispatch={(msg) => dispatch({ _tag: 'FormMsg', subMsg: msg })}
            />
            <FormItemMemo
              field={loginPasswordField}
              model={model.form}
              dispatch={(msg) => dispatch({ _tag: 'FormMsg', subMsg: msg })}
            />
          </fieldset>

          {RD.isFailure(model.requestRd) && (
            <ErrorMessagesMemo error={model.requestRd.error} />
          )}

          <div className='pt-[16px]'>
            <DsButtonMemo
              type='submit'
              isFullWidth={true}
              isLoading={RD.isPending(model.requestRd)}
              dataTest='login-btn'
            >
              Sign in
            </DsButtonMemo>
          </div>
        </form>
      </div>
    </div>
  )
}

export const LoginPageMemo = memo(LoginPageComponent, PropsEq.equals)
