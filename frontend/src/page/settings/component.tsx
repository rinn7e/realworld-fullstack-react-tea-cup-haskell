import * as RD from '@devexperts/remote-data-ts'
import { FormItemMemo } from '@rinn7e/tea-cup-form/lib/component'
import { cn } from '@rinn7e/tea-cup-prelude'
import { Loader2 } from 'lucide-react'
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
            <button
              className={cn(
                'relative flex items-center justify-center rounded bg-green-600 px-[20px] py-[10px] text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-60',
                RD.isPending(model.requestRd) && 'pointer-events-none',
              )}
              type='submit'
            >
              <span
                className={cn(RD.isPending(model.requestRd) && 'opacity-0')}
              >
                Update Settings
              </span>
              {RD.isPending(model.requestRd) && (
                <div className='absolute inset-0 flex items-center justify-center'>
                  <Loader2 className='h-4 w-4 animate-spin' />
                </div>
              )}
            </button>
          </div>
        </form>

        <hr className='border-gray-200' />

        <div className='flex flex-col'>
          <button
            type='button'
            className='cursor-pointer self-start rounded border border-red-400 px-[16px] py-[8px] text-sm text-red-500 transition-colors hover:bg-red-50'
            data-test='logout-btn'
            onClick={() => dispatch({ _tag: 'Logout' })}
          >
            Or click here to logout.
          </button>
        </div>
      </div>
    </div>
  )
}

export const SettingsPageMemo = memoStrategy(
  SettingsPageComponent,
  PropsEq.equals,
)
