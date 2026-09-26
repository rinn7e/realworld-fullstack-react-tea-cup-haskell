import { ButtonMemo as DsButtonMemo } from '@rinn7e/realworld-design-system/element/button/component'
import { TitleMemo as DsTitleMemo } from '@rinn7e/realworld-design-system/element/title/component'
import { InputMemo as DsInputMemo } from '@rinn7e/realworld-design-system/form/input/component'
import { HeroMemo as DsHeroMemo } from '@rinn7e/realworld-design-system/layout/hero/component'
import { Code2, Sparkles } from 'lucide-react'
import React, { memo } from 'react'

import {
  DEFAULT_SECTION_BOX_CLASS,
  SectionViewMemo,
} from '@/component/section-view'

import { type Props, PropsEq } from './type'

const InputPageComponent = ({ model, dispatch }: Props) => {
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
    <div
      data-component='InputPage'
      className='flex w-full flex-col gap-8 text-left'
    >
      <DsHeroMemo
        color='gray'
        size='small'
        className='w-full rounded-lg border border-gray-200 bg-gray-50 px-6 py-6 dark:border-zinc-800 dark:bg-zinc-950'
      >
        <>
          <div className='pb-1 text-xs font-bold tracking-wider text-green-600 uppercase'>
            FORM / INPUT
          </div>
          <DsTitleMemo
            size={2}
            className='pb-2 font-extrabold text-gray-900 dark:text-zinc-100'
          >
            Input
          </DsTitleMemo>
          <p className='text-base text-gray-600 dark:text-zinc-400'>
            Text input control supporting interactive state, sizes, rounded pill
            styling, error states, and input types.
          </p>
        </>
      </DsHeroMemo>

      <div className='flex w-full flex-col gap-6'>
        <div className='flex w-full items-center justify-between'>
          <DsTitleMemo
            size={5}
            className='flex items-center gap-2 font-bold tracking-wider text-gray-600 uppercase dark:text-zinc-400'
          >
            <>
              <Sparkles className='h-4 w-4 text-green-600' />
              <span>Interactive Playground &amp; Code</span>
            </>
          </DsTitleMemo>
          <DsButtonMemo
            color='green'
            variant='link'
            size='small'
            onClick={() => dispatch({ _tag: 'ToggleShowCode' })}
            className='flex items-center gap-1 font-semibold text-green-600 hover:underline'
          >
            <Code2 className='h-3.5 w-3.5' />
            <span>{model.showCode ? 'Hide Code' : 'Show Code'}</span>
          </DsButtonMemo>
        </div>

        {/* Section 1: Interactive Controlled Input */}
        <SectionViewMemo
          title='Interactive State'
          boxClassName={DEFAULT_SECTION_BOX_CLASS}
        >
          <div className='flex w-full flex-col gap-3'>
            {
              <DsInputMemo
                value={model.value}
                placeholder='Type here to test interactive state binding...'
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  dispatch({ _tag: 'UpdateValue', value: e.target.value })
                }
              />
            }
            <p className='text-xs text-gray-500 dark:text-zinc-400'>
              Current Model Value:{' '}
              <span className='font-mono font-bold text-gray-800 dark:text-zinc-200'>
                {model.value || '(empty)'}
              </span>
            </p>
          </div>
        </SectionViewMemo>

        {/* Section 2: Sizes & Shapes */}
        <SectionViewMemo
          title='Sizes & Shapes'
          boxClassName={DEFAULT_SECTION_BOX_CLASS}
        >
          <div className='flex w-full flex-col gap-4'>
            <div>
              <span className='block pb-1 text-xs font-medium text-gray-500 dark:text-zinc-400'>
                Small
              </span>
              {<DsInputMemo size='small' placeholder='Small input field...' />}
            </div>
            <div>
              <span className='block pb-1 text-xs font-medium text-gray-500 dark:text-zinc-400'>
                Normal
              </span>
              {
                <DsInputMemo
                  size='normal'
                  placeholder='Normal input field...'
                />
              }
            </div>
            <div>
              <span className='block pb-1 text-xs font-medium text-gray-500 dark:text-zinc-400'>
                Medium
              </span>
              {
                <DsInputMemo
                  size='medium'
                  placeholder='Medium input field...'
                />
              }
            </div>
            <div>
              <span className='block pb-1 text-xs font-medium text-gray-500 dark:text-zinc-400'>
                Large
              </span>
              {<DsInputMemo size='large' placeholder='Large input field...' />}
            </div>
            <div>
              <span className='block pb-1 text-xs font-medium text-gray-500 dark:text-zinc-400'>
                Rounded Pill
              </span>
              {
                <DsInputMemo
                  isRounded={true}
                  placeholder='Search articles, tags, or authors...'
                />
              }
            </div>
          </div>
        </SectionViewMemo>

        {/* Section 3: Validation States */}
        <SectionViewMemo
          title='Validation & Disabled States'
          boxClassName={DEFAULT_SECTION_BOX_CLASS}
        >
          <div className='flex w-full flex-col gap-4'>
            <div>
              <span className='block pb-1 text-xs font-medium text-gray-500 dark:text-zinc-400'>
                Error State
              </span>
              {
                <DsInputMemo
                  isError={true}
                  value='invalid-email-address'
                  placeholder='Enter valid email...'
                />
              }
            </div>
            <div>
              <span className='block pb-1 text-xs font-medium text-gray-500 dark:text-zinc-400'>
                Disabled State
              </span>
              {
                <DsInputMemo
                  isDisabled={true}
                  value='System read-only value'
                  placeholder='Disabled...'
                />
              }
            </div>
          </div>
        </SectionViewMemo>

        {model.showCode && (
          <div className='relative flex w-full flex-col gap-3 overflow-x-auto rounded-lg border border-gray-800 bg-gray-900 p-5 font-mono text-xs text-gray-100 shadow-lg'>
            <div className='flex items-center justify-between border-b border-gray-800 pb-3 font-sans text-xs text-gray-400'>
              <span className='font-semibold text-green-400'>JSX / HTML</span>
              <span className='text-gray-500 dark:text-zinc-400'>
                Input Component Code
              </span>
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

export const InputPageMemo = memo(InputPageComponent, PropsEq.equals)
