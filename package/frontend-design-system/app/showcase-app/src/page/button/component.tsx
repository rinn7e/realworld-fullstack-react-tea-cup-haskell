import { Button, Hero, Title } from '@rinn7e/realworld-design-system'
import { Code2, Sparkles } from 'lucide-react'
import React from 'react'
import type { Dispatcher } from 'tea-cup-fp'

import { sectionView } from '../../component/section-view'
import type { Model, Msg } from './type'

interface Props {
  model: Model
  dispatch: Dispatcher<Msg>
}

export const ButtonPage: React.FC<Props> = ({ model, dispatch }) => {
  const code = `// Colors & Variants
{Button.view({ variant: 'default', children: 'Default' })}
{Button.view({ variant: 'primary', children: 'Primary' })}
{Button.view({ variant: 'link', children: 'Link' })}
{Button.view({ variant: 'info', children: 'Info' })}
{Button.view({ variant: 'success', children: 'Success' })}
{Button.view({ variant: 'warning', children: 'Warning' })}
{Button.view({ variant: 'danger', children: 'Danger' })}

// Outlined Style
{Button.view({ variant: 'primary', isOutlined: true, children: 'Primary' })}
{Button.view({ variant: 'link', isOutlined: true, children: 'Link' })}

// Sizes & Shapes
{Button.view({ size: 'small', children: 'Small' })}
{Button.view({ size: 'normal', children: 'Normal' })}
{Button.view({ size: 'medium', children: 'Medium' })}
{Button.view({ size: 'large', children: 'Large' })}
{Button.view({ isRounded: true, children: 'Rounded' })}

// States & Width
{Button.view({ isDisabled: true, children: 'Disabled' })}
{Button.view({ isLoading: true, children: 'Loading' })}
{Button.view({ isFullWidth: true, children: 'Full Width Button' })}`

  return (
    <div data-component='ButtonPage' className='w-full space-y-8 text-left'>
      {Hero.view({
        variant: 'default',
        size: 'small',
        className:
          'rounded-lg bg-gray-50 border border-gray-200 px-6 py-6 w-full',
        children: (
          <>
            <div className='mb-1 text-xs font-bold tracking-wider text-green-600 uppercase'>
              ELEMENTS / BUTTON
            </div>
            {Title.view({
              size: 2,
              className: 'mb-2 font-extrabold text-gray-900',
              children: 'Button',
            })}
            <p className='text-base text-gray-600'>
              Essential button element with support for all color variants,
              sizes, styles (outlined, rounded), and states (loading, disabled).
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

        {/* Section 1: Colors & Variants */}
        {sectionView({
          title: 'Colors & Variants',
          children: (
            <div className='flex flex-wrap items-center gap-3'>
              {Button.view({ variant: 'default', children: 'Default' })}
              {Button.view({ variant: 'primary', children: 'Primary' })}
              {Button.view({ variant: 'link', children: 'Link' })}
              {Button.view({ variant: 'info', children: 'Info' })}
              {Button.view({ variant: 'success', children: 'Success' })}
              {Button.view({ variant: 'warning', children: 'Warning' })}
              {Button.view({ variant: 'danger', children: 'Danger' })}
            </div>
          ),
        })}

        {/* Section 2: Outlined Style */}
        {sectionView({
          title: 'Outlined Style',
          children: (
            <div className='flex flex-wrap items-center gap-3'>
              {Button.view({
                variant: 'default',
                isOutlined: true,
                children: 'Default',
              })}
              {Button.view({
                variant: 'primary',
                isOutlined: true,
                children: 'Primary',
              })}
              {Button.view({
                variant: 'link',
                isOutlined: true,
                children: 'Link',
              })}
              {Button.view({
                variant: 'info',
                isOutlined: true,
                children: 'Info',
              })}
              {Button.view({
                variant: 'success',
                isOutlined: true,
                children: 'Success',
              })}
              {Button.view({
                variant: 'warning',
                isOutlined: true,
                children: 'Warning',
              })}
              {Button.view({
                variant: 'danger',
                isOutlined: true,
                children: 'Danger',
              })}
            </div>
          ),
        })}

        {/* Section 3: Sizes & Shapes */}
        {sectionView({
          title: 'Sizes & Shapes',
          children: (
            <div className='space-y-4'>
              <div className='flex flex-wrap items-center gap-3'>
                {Button.view({
                  variant: 'primary',
                  size: 'small',
                  children: 'Small',
                })}
                {Button.view({
                  variant: 'primary',
                  size: 'normal',
                  children: 'Normal',
                })}
                {Button.view({
                  variant: 'primary',
                  size: 'medium',
                  children: 'Medium',
                })}
                {Button.view({
                  variant: 'primary',
                  size: 'large',
                  children: 'Large',
                })}
              </div>
              <div className='flex flex-wrap items-center gap-3 pt-2'>
                {Button.view({
                  variant: 'primary',
                  isRounded: true,
                  size: 'small',
                  children: 'Rounded Small',
                })}
                {Button.view({
                  variant: 'primary',
                  isRounded: true,
                  size: 'normal',
                  children: 'Rounded Normal',
                })}
                {Button.view({
                  variant: 'primary',
                  isRounded: true,
                  size: 'medium',
                  children: 'Rounded Medium',
                })}
                {Button.view({
                  variant: 'primary',
                  isRounded: true,
                  size: 'large',
                  children: 'Rounded Large',
                })}
              </div>
            </div>
          ),
        })}

        {/* Section 4: States & Width */}
        {sectionView({
          title: 'States & Width',
          children: (
            <div className='w-full space-y-4'>
              <div className='flex flex-wrap items-center gap-3'>
                {Button.view({
                  variant: 'success',
                  isDisabled: true,
                  children: 'Disabled Button',
                })}
                {Button.view({
                  variant: 'danger',
                  isLoading: model.isLoading,
                  onClick: () => dispatch({ _tag: 'ToggleLoading' }),
                  children: model.isLoading
                    ? 'Processing...'
                    : 'Click to Toggle Loading',
                })}
              </div>
              <div className='pt-2'>
                {Button.view({
                  variant: 'primary',
                  isFullWidth: true,
                  children: 'Full Width Button',
                })}
              </div>
            </div>
          ),
        })}

        {model.showCode && (
          <div className='relative w-full overflow-x-auto rounded-lg border border-gray-800 bg-gray-900 p-5 font-mono text-xs text-gray-100 shadow-lg'>
            <div className='mb-3 flex items-center justify-between border-b border-gray-800 pb-3 font-sans text-xs text-gray-400'>
              <span className='font-semibold text-green-400'>JSX / HTML</span>
              <span className='text-gray-500'>Button Component Code</span>
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
