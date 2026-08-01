import React from 'react'
import {
  Button,
  Hero,
  Input,
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

export const InputPage: React.FC<Props> = ({ model, dispatch }) => {
  const code = `// Interactive Controlled Input
{Input.view({
  value: model.value,
  placeholder: 'Type something...',
  onChange: (e) => dispatch({ _tag: 'UpdateValue', value: e.target.value }),
})}

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
    <div data-component='InputPage' className='w-full text-left space-y-8'>
      {Hero.view({
        variant: 'default',
        size: 'small',
        className: 'rounded-lg bg-gray-50 border border-gray-200 px-6 py-6 w-full',
        children: (
          <>
            <div className='mb-1 text-xs font-bold uppercase tracking-wider text-green-600'>
              FORM / INPUT
            </div>
            {Title.view({
              size: 2,
              className: 'mb-2 font-extrabold text-gray-900',
              children: 'Input',
            })}
            <p className='text-base text-gray-600'>
              Text input control supporting interactive state, sizes, rounded pill styling, error states, and input types.
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

        {/* Section 1: Interactive Controlled Input */}
        {sectionView({
          title: 'Interactive State',
          children: (
            <div className='w-full space-y-3'>
              {Input.view({
                value: model.value,
                placeholder: 'Type here to test interactive state binding...',
                onChange: (e) => dispatch({ _tag: 'UpdateValue', value: e.target.value }),
              })}
              <p className='text-xs text-gray-500'>
                Current Model Value: <span className='font-mono font-bold text-gray-800'>{model.value || '(empty)'}</span>
              </p>
            </div>
          ),
        })}

        {/* Section 2: Sizes & Shapes */}
        {sectionView({
          title: 'Sizes & Shapes',
          children: (
            <div className='w-full space-y-4'>
              <div>
                <span className='text-xs font-medium text-gray-500 mb-1 block'>Small</span>
                {Input.view({ size: 'small', placeholder: 'Small input field...' })}
              </div>
              <div>
                <span className='text-xs font-medium text-gray-500 mb-1 block'>Normal</span>
                {Input.view({ size: 'normal', placeholder: 'Normal input field...' })}
              </div>
              <div>
                <span className='text-xs font-medium text-gray-500 mb-1 block'>Medium</span>
                {Input.view({ size: 'medium', placeholder: 'Medium input field...' })}
              </div>
              <div>
                <span className='text-xs font-medium text-gray-500 mb-1 block'>Large</span>
                {Input.view({ size: 'large', placeholder: 'Large input field...' })}
              </div>
              <div>
                <span className='text-xs font-medium text-gray-500 mb-1 block'>Rounded Pill</span>
                {Input.view({ isRounded: true, placeholder: 'Search articles, tags, or authors...' })}
              </div>
            </div>
          ),
        })}

        {/* Section 3: Validation States */}
        {sectionView({
          title: 'Validation & Disabled States',
          children: (
            <div className='w-full space-y-4'>
              <div>
                <span className='text-xs font-medium text-gray-500 mb-1 block'>Error State</span>
                {Input.view({ isError: true, value: 'invalid-email-address', placeholder: 'Enter valid email...' })}
              </div>
              <div>
                <span className='text-xs font-medium text-gray-500 mb-1 block'>Disabled State</span>
                {Input.view({ isDisabled: true, value: 'System read-only value', placeholder: 'Disabled...' })}
              </div>
            </div>
          ),
        })}

        {model.showCode && (
          <div className='relative w-full overflow-x-auto rounded-lg border border-gray-800 bg-gray-900 p-5 font-mono text-xs text-gray-100 shadow-lg'>
            <div className='mb-3 flex items-center justify-between border-b border-gray-800 pb-3 font-sans text-xs text-gray-400'>
              <span className='font-semibold text-green-400'>JSX / HTML</span>
              <span className='text-gray-500'>Input Component Code</span>
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
