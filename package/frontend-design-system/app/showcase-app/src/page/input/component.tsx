import { InputMemo } from '@rinn7e/realworld-design-system/form/input/component'
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
export const InputPage: React.FC<Props> = ({ model, dispatch }) => {
  const code = `// Interactive Controlled Input
{Input.view({
  value: model.value,
  placeholder: 'Type something...',
  onChange: (e) => dispatch({ _tag: 'UpdateValue', value: e.target.value }) })}

// Sizes & Shapes
{Input.view({ size: 'small', placeholder: 'Small input' })}
{Input.view({ size: 'normal', placeholder: 'Normal input' })}
{Input.view({ size: 'medium', placeholder: 'Medium input' })}
{Input.view({ size: 'large', placeholder: 'Large input' })}
{Input.view({ isRounded: true, placeholder: 'Rounded input pill' })}

// States
{Input.view({ isError: true, value: 'invalid-email', placeholder: 'Error state' })}
{Input.view({ isDisabled: true, value: 'Read only text', placeholder: 'Disabled state' })}

// Input Types
{Input.view({ type: 'password', value: 'secretpass', placeholder: 'Password input' })}
{Input.view({ type: 'email', placeholder: 'email@example.com' })}`
  return (
    <div data-component='InputPage' className='w-full space-y-8 text-left'>
      <HeroMemo variant="default" size="small" className="rounded-lg bg-gray-50 border border-gray-200 px-6 py-6 w-full" children={() => (<><div className='mb-1 text-xs font-bold tracking-wider text-green-600 uppercase'>
              FORM / INPUT
            </div>
            <TitleMemo size={2} className='mb-2 font-extrabold text-gray-900' children={() => 'Input'} />
            <p className='text-base text-gray-600'>
              Text input control supporting interactive state, sizes, rounded
              pill styling, error states, and input types.
            </p></>)} />

      <div className='flex w-full flex-col gap-6'>
        <div className='flex w-full items-center justify-between'>
          <TitleMemo size={5} className="flex items-center gap-2 font-bold uppercase tracking-wider text-gray-600" children={() => (<><Sparkles className="h-4 w-4 text-green-600" /><span>Interactive Playground &amp; Code</span></>)} />
          <ButtonMemo color="green" variant="link" size="small" onClick={() => dispatch({ _tag: "ToggleShowCode" })} className="flex items-center gap-1 font-semibold text-green-600 hover:underline" children={() => (<><Code2 className="h-3.5 w-3.5" /><span>{model.showCode ? "Hide Code" : "Show Code"}</span></>)} />
        </div>

        {/* Section 1: Interactive Controlled Input */}
        {sectionView({
          title: 'Interactive State',
          children: () => (
            <div className='w-full space-y-3'>
              {<InputMemo value={model.value} placeholder='Type here to test interactive state binding...' onChange={(e: React.ChangeEvent<HTMLInputElement>) => dispatch({ _tag: 'UpdateValue', value: e.target.value })} />}
              <p className='text-xs text-gray-500'>
                Current Model Value:{' '}
                <span className='font-mono font-bold text-gray-800'>
                  {model.value || '(empty)'}
                </span>
              </p>
            </div>
          ) })}

        {/* Section 2: Sizes & Shapes */}
        {sectionView({
          title: 'Sizes & Shapes',
          children: () => (
            <div className='w-full space-y-4'>
              <div>
                <span className='mb-1 block text-xs font-medium text-gray-500'>
                  Small
                </span>
                {<InputMemo size='small' placeholder='Small input field...' />}
              </div>
              <div>
                <span className='mb-1 block text-xs font-medium text-gray-500'>
                  Normal
                </span>
                {<InputMemo size='normal' placeholder='Normal input field...' />}
              </div>
              <div>
                <span className='mb-1 block text-xs font-medium text-gray-500'>
                  Medium
                </span>
                {<InputMemo size='medium' placeholder='Medium input field...' />}
              </div>
              <div>
                <span className='mb-1 block text-xs font-medium text-gray-500'>
                  Large
                </span>
                {<InputMemo size='large' placeholder='Large input field...' />}
              </div>
              <div>
                <span className='mb-1 block text-xs font-medium text-gray-500'>
                  Rounded Pill
                </span>
                {<InputMemo isRounded={true} placeholder='Search articles, tags, or authors...' />}
              </div>
            </div>
          ) })}

        {/* Section 3: Validation States */}
        {sectionView({
          title: 'Validation & Disabled States',
          children: () => (
            <div className='w-full space-y-4'>
              <div>
                <span className='mb-1 block text-xs font-medium text-gray-500'>
                  Error State
                </span>
                {<InputMemo isError={true} value='invalid-email-address' placeholder='Enter valid email...' />}
              </div>
              <div>
                <span className='mb-1 block text-xs font-medium text-gray-500'>
                  Disabled State
                </span>
                {<InputMemo isDisabled={true} value='System read-only value' placeholder='Disabled...' />}
              </div>
            </div>
          ) })}

        {model.showCode && (
          <div className='relative w-full overflow-x-auto rounded-lg border border-gray-800 bg-gray-900 p-5 font-mono text-xs text-gray-100 shadow-lg'>
            <div className='mb-3 flex items-center justify-between border-b border-gray-800 pb-3 font-sans text-xs text-gray-400'>
              <span className='font-semibold text-green-400'>JSX / HTML</span>
              <span className='text-gray-500'>Input Component Code</span>
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
