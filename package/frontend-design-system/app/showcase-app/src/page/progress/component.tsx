import { Button, Hero, Progress, Title } from '@rinn7e/realworld-design-system'
import { Code2, Sparkles } from 'lucide-react'
import React from 'react'
import type { Dispatcher } from 'tea-cup-fp'

import { sectionView } from '../../component/section-view'
import type { Model, Msg } from './type'

interface Props {
  model: Model
  dispatch: Dispatcher<Msg>
}

export const ProgressPage: React.FC<Props> = ({ model, dispatch }) => {
  const code = `// Standard Progress Bar (Determinate)
{Progress.view({ value: 60, max: 100, variant: 'primary' })}

// Color Variants
{Progress.view({ value: 30, variant: 'primary' })}
{Progress.view({ value: 45, variant: 'link' })}
{Progress.view({ value: 60, variant: 'info' })}
{Progress.view({ value: 75, variant: 'success' })}
{Progress.view({ value: 90, variant: 'warning' })}
{Progress.view({ value: 100, variant: 'danger' })}

// Sizes
{Progress.view({ value: 50, size: 'xsmall' })}
{Progress.view({ value: 50, size: 'small' })}
{Progress.view({ value: 50, size: 'normal' })}
{Progress.view({ value: 50, size: 'medium' })}
{Progress.view({ value: 50, size: 'large' })}

// Indeterminate Progress Bar
{Progress.view({ isIndeterminate: true, variant: 'primary' })}`

  return (
    <div data-component='ProgressPage' className='w-full space-y-8 text-left'>
      {Hero.view({
        variant: 'default',
        size: 'small',
        className:
          'rounded-lg bg-gray-50 border border-gray-200 px-6 py-6 w-full',
        children: (
          <>
            <div className='mb-1 text-xs font-bold tracking-wider text-green-600 uppercase'>
              ELEMENTS / PROGRESS
            </div>
            {Title.view({
              size: 2,
              className: 'mb-2 font-extrabold text-gray-900',
              children: 'Progress',
            })}
            <p className='text-base text-gray-600'>
              Standard progress bars with support for different color variants,
              sizes, values, and indeterminate loading states.
            </p>
          </>
        ),
      })}

      <div className='flex w-full flex-col gap-6'>
        <div className='flex w-full items-center justify-between'>
          {Title.view({
            size: 5,
            className:
              'flex items-center gap-2 font-bold uppercase tracking-wider text-gray-600',
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
            className:
              'flex items-center gap-1 font-semibold text-green-600 hover:underline',
            children: (
              <>
                <Code2 className='h-3.5 w-3.5' />
                <span>{model.showCode ? 'Hide Code' : 'Show Code'}</span>
              </>
            ),
          })}
        </div>

        {/* Section 1: Color Variants */}
        {sectionView({
          title: 'Color Variants',
          children: (
            <div className='w-full space-y-4'>
              <div>
                <span className='mb-1 block text-xs font-medium text-gray-500'>
                  Primary (30%)
                </span>
                {Progress.view({ value: 30, max: 100, variant: 'primary' })}
              </div>
              <div>
                <span className='mb-1 block text-xs font-medium text-gray-500'>
                  Link (45%)
                </span>
                {Progress.view({ value: 45, max: 100, variant: 'link' })}
              </div>
              <div>
                <span className='mb-1 block text-xs font-medium text-gray-500'>
                  Info (60%)
                </span>
                {Progress.view({ value: 60, max: 100, variant: 'info' })}
              </div>
              <div>
                <span className='mb-1 block text-xs font-medium text-gray-500'>
                  Success (75%)
                </span>
                {Progress.view({ value: 75, max: 100, variant: 'success' })}
              </div>
              <div>
                <span className='mb-1 block text-xs font-medium text-gray-500'>
                  Warning (90%)
                </span>
                {Progress.view({ value: 90, max: 100, variant: 'warning' })}
              </div>
              <div>
                <span className='mb-1 block text-xs font-medium text-gray-500'>
                  Danger (100%)
                </span>
                {Progress.view({ value: 100, max: 100, variant: 'danger' })}
              </div>
            </div>
          ),
        })}

        {/* Section 2: Sizes */}
        {sectionView({
          title: 'Sizes',
          children: (
            <div className='w-full space-y-4'>
              <div>
                <span className='mb-1 block text-xs font-medium text-gray-500'>
                  Very small
                </span>
                {Progress.view({
                  value: 50,
                  size: 'xsmall',
                  variant: 'primary',
                })}
              </div>
              <div>
                <span className='mb-1 block text-xs font-medium text-gray-500'>
                  Small
                </span>
                {Progress.view({
                  value: 50,
                  size: 'small',
                  variant: 'primary',
                })}
              </div>
              <div>
                <span className='mb-1 block text-xs font-medium text-gray-500'>
                  Normal
                </span>
                {Progress.view({
                  value: 50,
                  size: 'normal',
                  variant: 'primary',
                })}
              </div>
              <div>
                <span className='mb-1 block text-xs font-medium text-gray-500'>
                  Medium
                </span>
                {Progress.view({
                  value: 50,
                  size: 'medium',
                  variant: 'primary',
                })}
              </div>
              <div>
                <span className='mb-1 block text-xs font-medium text-gray-500'>
                  Large
                </span>
                {Progress.view({
                  value: 50,
                  size: 'large',
                  variant: 'primary',
                })}
              </div>
            </div>
          ),
        })}

        {/* Section 3: Indeterminate Loading State */}
        {sectionView({
          title: 'Indeterminate Loading State',
          children: (
            <div className='w-full space-y-4'>
              <div>
                <span className='mb-1 block text-xs font-medium text-gray-500'>
                  Indeterminate Primary
                </span>
                {Progress.view({ isIndeterminate: true, variant: 'primary' })}
              </div>
              <div>
                <span className='mb-1 block text-xs font-medium text-gray-500'>
                  Indeterminate Info
                </span>
                {Progress.view({ isIndeterminate: true, variant: 'info' })}
              </div>
              <div>
                <span className='mb-1 block text-xs font-medium text-gray-500'>
                  Indeterminate Success
                </span>
                {Progress.view({ isIndeterminate: true, variant: 'success' })}
              </div>
            </div>
          ),
        })}

        {model.showCode && (
          <div className='relative w-full overflow-x-auto rounded-lg border border-gray-800 bg-gray-900 p-5 font-mono text-xs text-gray-100 shadow-lg'>
            <div className='mb-3 flex items-center justify-between border-b border-gray-800 pb-3 font-sans text-xs text-gray-400'>
              <span className='font-semibold text-green-400'>JSX / HTML</span>
              <span className='text-gray-500'>Progress Component Code</span>
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
