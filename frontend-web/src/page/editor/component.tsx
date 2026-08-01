import * as RD from '@devexperts/remote-data-ts'
import { FormItemMemo } from '@rinn7e/tea-cup-form/component'
import { cn } from '@rinn7e/tea-cup-prelude'
import { Loader2 } from 'lucide-react'
import React from 'react'

import { memoStrategy } from '@/common/util'
import { ErrorMessages } from '@/component/error-messages'

import {
  type Props,
  PropsEq,
  editorBodyField,
  editorDescriptionField,
  editorTagInputField,
  editorTitleField,
} from './type'

const EditorPageComponent = ({ model, dispatch }: Props) => {
  const form = model.form

  return (
    <div
      className='mx-auto flex w-full max-w-[768px] flex-col gap-[24px] px-[16px] py-[32px]'
      data-test='editor-page'
    >
      <form
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
            field={editorTitleField}
            model={form}
            dispatch={(msg) => dispatch({ _tag: 'FormMsg', subMsg: msg })}
          />
          <FormItemMemo
            field={editorDescriptionField}
            model={form}
            dispatch={(msg) => dispatch({ _tag: 'FormMsg', subMsg: msg })}
          />
          <FormItemMemo
            field={editorBodyField}
            model={form}
            dispatch={(msg) => dispatch({ _tag: 'FormMsg', subMsg: msg })}
          />

          <FormItemMemo
            field={editorTagInputField}
            model={form}
            dispatch={(msg) => dispatch({ _tag: 'FormMsg', subMsg: msg })}
          />
        </fieldset>

        {RD.isFailure(model.requestRd) && (
          <ErrorMessages error={model.requestRd.error} />
        )}

        <div className='flex justify-end pt-[24px]'>
          <button
            className={cn(
              'relative flex items-center justify-center rounded bg-green-600 px-[20px] py-[10px] text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-60',
              RD.isPending(model.requestRd) && 'pointer-events-none',
            )}
            type='submit'
          >
            <span className={cn(RD.isPending(model.requestRd) && 'opacity-0')}>
              Publish Article
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
  )
}

export const EditorPageMemo = memoStrategy(EditorPageComponent, PropsEq.equals)
