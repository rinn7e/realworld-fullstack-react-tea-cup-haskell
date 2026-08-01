import * as RD from '@devexperts/remote-data-ts'
import { Button } from '@rinn7e/realworld-design-system'
import { FormItemMemo } from '@rinn7e/tea-cup-form/component'
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
          {Button.view({
            type: 'submit',
            isLoading: RD.isPending(model.requestRd),
            children: () => 'Publish Article',
          })}
        </div>
      </form>
    </div>
  )
}

export const EditorPageMemo = memoStrategy(EditorPageComponent, PropsEq.equals)
