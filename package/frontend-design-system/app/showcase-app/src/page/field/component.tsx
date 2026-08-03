import { InputMemo } from '@rinn7e/realworld-design-system/form/input/component'
import { FieldMemo } from '@rinn7e/realworld-design-system/form/field/component'
import { HeroMemo } from '@rinn7e/realworld-design-system/layout/hero/component'
import { ButtonMemo } from '@rinn7e/realworld-design-system/element/button/component'
import { TitleMemo } from '@rinn7e/realworld-design-system/element/title/component'
import { Code2, Sparkles } from 'lucide-react'
import React from 'react'
import type { Dispatcher } from 'tea-cup-fp'

import { sectionView } from '../../component/section-view'
import type { Model, Msg } from './type'

interface Props {
  model: Model
  dispatch: Dispatcher<Msg>
}
export const FieldPage: React.FC<Props> = ({ model, dispatch }) => {
  const code = `{Field.view({
  label: 'Username',
  helpText: 'Choose a unique handle for your Conduit profile.',
  children: Input.view({
    value: model.value,
    placeholder: 'e.g. gerard_quan',
    onChange: (e) => dispatch({ _tag: 'UpdateValue', value: e.target.value }) }) })}`
  return (
    <div data-component='FieldPage' className='w-full space-y-8 text-left'>
      <HeroMemo variant="default" size="small" className="rounded-lg bg-gray-50 border border-gray-200 px-6 py-6 w-full" children={() => (<><div className='mb-1 text-xs font-bold tracking-wider text-green-600 uppercase'>
              FORM / FIELD
            </div>
            <TitleMemo size={2} className='mb-2 font-extrabold text-gray-900' children={() => 'Field'} />
            <p className='text-base text-gray-600'>
              Form field wrapper container with field label and optional
              help/error text.
            </p></>)} />

      <div className='flex w-full flex-col gap-6'>
        <div className='flex w-full items-center justify-between'>
          <TitleMemo size={5} className="flex items-center gap-2 font-bold uppercase tracking-wider text-gray-600" children={() => (<><Sparkles className="h-4 w-4 text-green-600" /><span>Interactive Playground &amp; Code</span></>)} />
          <ButtonMemo color="green" variant="link" size="small" onClick={() => dispatch({ _tag: "ToggleShowCode" })} className="flex items-center gap-1 font-semibold text-green-600 hover:underline" children={() => (<><Code2 className="h-3.5 w-3.5" /><span>{model.showCode ? "Hide Code" : "Show Code"}</span></>)} />
        </div>

        {sectionView({
          title: 'Form Field Container',
          children: () => (
            <div className='w-full max-w-md'>
              <FieldMemo
                label='Username'
                helpText='Choose a unique handle for your Conduit profile.'
                children={() => (
                  <InputMemo
                    value={model.value}
                    placeholder='e.g. gerard_quan'
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      dispatch({ _tag: 'UpdateValue', value: e.target.value })
                    }
                  />
                )}
              />
            </div>
          ) })}

        {model.showCode && (
          <div className='relative w-full overflow-x-auto rounded-lg border border-gray-800 bg-gray-900 p-5 font-mono text-xs text-gray-100 shadow-lg'>
            <div className='mb-3 flex items-center justify-between border-b border-gray-800 pb-3 font-sans text-xs text-gray-400'>
              <span className='font-semibold text-green-400'>JSX / HTML</span>
              <span className='text-gray-500'>Field Component Code</span>
            </div>
            <pre className='font-mono text-xs leading-relaxed whitespace-pre-wrap text-gray-300'>
              <code>{code}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
