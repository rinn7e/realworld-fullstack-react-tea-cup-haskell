import * as RD from '@devexperts/remote-data-ts'
import { ButtonMemo as DsButtonMemo } from '@rinn7e/realworld-design-system/element/button/component'
import { FormItemMemo } from '@rinn7e/tea-cup-form/component'
import React from 'react'

import { memoStrategy } from '@/common/util'
import { ErrorMessages } from '@/component/error-messages'

import {
  type Props,
  PropsEq,
  settingsBioField,
  settingsEmailField,
  settingsImageField,
  settingsPasswordConfirmationField,
  settingsPasswordField,
  settingsUsernameField,
} from './type'

const SettingsPageComponent = ({ model, dispatch }: Props) => {
  const form = model.form

  return (
    <div
      className='flex min-h-full items-start justify-center px-[16px] pt-[64px] pb-[32px]'
      data-test='settings-page'
    >
      <div className='flex w-full max-w-[448px] flex-col gap-[24px]'>
        <h1 className='text-center text-3xl font-bold text-gray-900'>
          Your Settings
        </h1>

        <form
          className='flex flex-col gap-[24px]'
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
              field={settingsImageField}
              model={form}
              dispatch={(msg) => dispatch({ _tag: 'FormMsg', subMsg: msg })}
            />
            <FormItemMemo
              field={settingsUsernameField}
              model={form}
              dispatch={(msg) => dispatch({ _tag: 'FormMsg', subMsg: msg })}
            />
            <FormItemMemo
              field={settingsBioField}
              model={form}
              dispatch={(msg) => dispatch({ _tag: 'FormMsg', subMsg: msg })}
            />
            <FormItemMemo
              field={settingsEmailField}
              model={form}
              dispatch={(msg) => dispatch({ _tag: 'FormMsg', subMsg: msg })}
            />
            <FormItemMemo
              field={settingsPasswordField}
              model={form}
              dispatch={(msg) => dispatch({ _tag: 'FormMsg', subMsg: msg })}
            />
            <FormItemMemo
              field={settingsPasswordConfirmationField}
              model={form}
              dispatch={(msg) => dispatch({ _tag: 'FormMsg', subMsg: msg })}
            />
          </fieldset>

          {RD.isFailure(model.requestRd) && (
            <ErrorMessages error={model.requestRd.error} />
          )}

          <div className='flex justify-end pt-[16px]'>
            <DsButtonMemo
              type='submit'
              isLoading={RD.isPending(model.requestRd)}
              children={() => 'Update Settings'}
            />
          </div>
        </form>

        <hr className='border-gray-200' />

        <div className='flex flex-col items-start'>
          <DsButtonMemo
            color='red'
            variant='outline'
            dataTest='logout-btn'
            onClick={() => dispatch({ _tag: 'Logout' })}
            className='self-start'
            children={() => 'Or click here to logout.'}
          />
        </div>
      </div>
    </div>
  )
}

export const SettingsPageMemo = memoStrategy(
  SettingsPageComponent,
  PropsEq.equals,
)
