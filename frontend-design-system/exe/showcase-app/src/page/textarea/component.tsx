import React from 'react'
import {
  Button,
  Hero,
  Textarea,
  Title,
} from '@rinn7e/realworld-design-system'
import { Code2, Sparkles } from 'lucide-react'
import type { Dispatcher } from 'tea-cup-fp'
import { sectionView } from '../../component/section-view'
import type { Model, Msg } from './type'

interface Props {
  model: Model
  dispatch: Dispatcher<Msg>
}

export const TextareaPage: React.FC<Props> = ({ model, dispatch }) => {
  const code = `// Interactive Textarea
{Textarea.view({
  value: model.value,
  rows: 4,
  placeholder: 'Write your article in markdown...',
  onChange: (e) => dispatch({ _tag: 'UpdateValue', value: e.target.value }),
})}

// State Variations
{Textarea.view({ isError: true, value: 'Invalid markdown content', rows: 3 })}
{Textarea.view({ isDisabled: true, value: 'Read-only content body', rows: 3 })}`

  return (
    <div data-component='TextareaPage' className='w-full text-left space-y-8'>
      {Hero.view({
        variant: 'default',
        size: 'small',
        className: 'rounded-lg bg-gray-50 border border-gray-200 px-6 py-6 w-full',
        children: (
          <>
            <div className='mb-1 text-xs font-bold uppercase tracking-wider text-green-600'>
              FORM / TEXTAREA
            </div>
            {Title.view({
              size: 2,
              className: 'mb-2 font-extrabold text-gray-900',
              children: 'Textarea',
            })}
            <p className='text-base text-gray-600'>
              Multi-line text input control with support for interactive state, row sizes, validation errors, and disabled states.
            </p>
          </>
        ),
      })}

      <div className='flex flex-col gap-6 w-full'>
        <div className='flex items-center justify-between w-full'>
          {Title.view({
            size: 5,
            className: 'flex items-center gap-2 font-bold uppercase tracking-wider text-gray-600',
            children: (
              <>
                <Sparkles className='h-4 w-4 text-green-600' />
                <span>Interactive Playground &amp; Code</span>
              </>
            ),
          })}
          {Button.view({
            variant: 'link',
            size: 'small',
            onClick: () => dispatch({ _tag: 'ToggleShowCode' }),
            className: 'flex items-center gap-1 font-semibold text-green-600 hover:underline',
            children: (
              <>
                <Code2 className='h-3.5 w-3.5' />
                <span>{model.showCode ? 'Hide Code' : 'Show Code'}</span>
              </>
            ),
          })}
        </div>

        {/* Section 1: Interactive Textarea */}
        {sectionView({
          title: 'Interactive Textarea',
          children: (
            <div className='w-full space-y-3'>
              {Textarea.view({
                value: model.value,
                rows: 4,
                placeholder: 'Write your article body (in markdown format)...',
                onChange: (e) => dispatch({ _tag: 'UpdateValue', value: e.target.value }),
              })}
              <p className='text-xs text-gray-500'>
                Character Count: <span className='font-mono font-bold text-gray-800'>{model.value.length}</span>
              </p>
            </div>
          ),
        })}

        {/* Section 2: Validation & Disabled States */}
        {sectionView({
          title: 'Validation &amp; Disabled States',
          children: (
            <div className='w-full space-y-4'>
              <div>
                <span className='text-xs font-medium text-gray-500 mb-1 block'>Error State</span>
                {Textarea.view({ isError: true, value: 'Cannot submit empty post content.', rows: 3 })}
              </div>
              <div>
                <span className='text-xs font-medium text-gray-500 mb-1 block'>Disabled State</span>
                {Textarea.view({ isDisabled: true, value: 'System read-only logs and article notes.', rows: 3 })}
              </div>
            </div>
          ),
        })}

        {model.showCode && (
          <div className='relative w-full overflow-x-auto rounded-lg border border-gray-800 bg-gray-900 p-5 font-mono text-xs text-gray-100 shadow-lg'>
            <div className='mb-3 flex items-center justify-between border-b border-gray-800 pb-3 font-sans text-xs text-gray-400'>
              <span className='font-semibold text-green-400'>JSX / HTML</span>
              <span className='text-gray-500'>Textarea Component Code</span>
            </div>
            <pre className='whitespace-pre-wrap font-mono text-xs leading-relaxed text-gray-300'>
              <code>{code}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
