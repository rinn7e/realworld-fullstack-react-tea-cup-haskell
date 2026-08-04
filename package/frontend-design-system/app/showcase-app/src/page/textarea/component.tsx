import { ButtonMemo as DsButtonMemo } from '@rinn7e/realworld-design-system/element/button/component'
import { TitleMemo as DsTitleMemo } from '@rinn7e/realworld-design-system/element/title/component'
import { TextareaMemo as DsTextareaMemo } from '@rinn7e/realworld-design-system/form/textarea/component'
import { HeroMemo as DsHeroMemo } from '@rinn7e/realworld-design-system/layout/hero/component'
import { Code2, Sparkles } from 'lucide-react'
import React from 'react'
import type { Dispatcher } from 'tea-cup-fp'

import { sectionView } from '../../component/section-view'
import type { Model, Msg } from './type'

interface Props {
  model: Model
  dispatch: Dispatcher<Msg>
}
export const TextareaPage: React.FC<Props> = ({ model, dispatch }) => {
  const code = `// Interactive Textarea
{<DsTextareaMemo
  value: model.value,
  rows: 4,
  placeholder: 'Write your article in markdown...',
  onChange: (e) => dispatch({ _tag: 'UpdateValue', value: e.target.value }) })}

// State Variations
{<DsTextareaMemo isError: true, value: 'Invalid markdown content', rows: 3 })}
{<DsTextareaMemo isDisabled: true, value: 'Read-only content body', rows: 3 })}`
  return (
    <div data-component='TextareaPage' className='w-full space-y-8 text-left'>
      <DsHeroMemo
        color='gray'
        size='small'
        className='w-full rounded-lg border border-gray-200 bg-gray-50 px-6 py-6 dark:border-zinc-800 dark:bg-zinc-950'
      >
        <>
          <div className='mb-1 text-xs font-bold tracking-wider text-green-600 uppercase'>
            FORM / TEXTAREA
          </div>
          <DsTitleMemo
            size={2}
            className='mb-2 font-extrabold text-gray-900 dark:text-zinc-100'
          >
            Textarea
          </DsTitleMemo>
          <p className='text-base text-gray-600 dark:text-zinc-400'>
            Multi-line text input control with support for interactive state,
            row sizes, validation errors, and disabled states.
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

        {/* Section 1: Interactive Textarea */}
        {sectionView({
          title: 'Interactive Textarea',
          children: () => (
            <div className='w-full space-y-3'>
              <DsTextareaMemo
                value={model.value}
                rows={4}
                placeholder='Write your article body (in markdown format)...'
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  dispatch({ _tag: 'UpdateValue', value: e.target.value })
                }
              />
              <p className='text-xs text-gray-500 dark:text-zinc-400'>
                Character Count:{' '}
                <span className='font-mono font-bold text-gray-800 dark:text-zinc-200'>
                  {model.value.length}
                </span>
              </p>
            </div>
          ),
        })}

        {/* Section 2: Validation & Disabled States */}
        {sectionView({
          title: 'Validation &amp; Disabled States',
          children: () => (
            <div className='w-full space-y-4'>
              <div>
                <span className='mb-1 block text-xs font-medium text-gray-500 dark:text-zinc-400'>
                  Error State
                </span>
                <DsTextareaMemo
                  isError={true}
                  value='Cannot submit empty post content.'
                  rows={3}
                />
              </div>
              <div>
                <span className='mb-1 block text-xs font-medium text-gray-500 dark:text-zinc-400'>
                  Disabled State
                </span>
                <DsTextareaMemo
                  isDisabled={true}
                  value='System read-only logs and article notes.'
                  rows={3}
                />
              </div>
            </div>
          ),
        })}

        {model.showCode && (
          <div className='relative w-full overflow-x-auto rounded-lg border border-gray-800 bg-gray-900 p-5 font-mono text-xs text-gray-100 shadow-lg'>
            <div className='mb-3 flex items-center justify-between border-b border-gray-800 pb-3 font-sans text-xs text-gray-400'>
              <span className='font-semibold text-green-400'>JSX / HTML</span>
              <span className='text-gray-500 dark:text-zinc-400'>
                Textarea Component Code
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
