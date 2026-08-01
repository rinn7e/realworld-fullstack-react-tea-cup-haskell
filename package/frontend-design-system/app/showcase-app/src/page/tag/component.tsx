import { Button, Hero, Tag, Title } from '@rinn7e/realworld-design-system'
import { Code2, Sparkles } from 'lucide-react'
import React from 'react'
import type { Dispatcher } from 'tea-cup-fp'

import { sectionView } from '../../component/section-view'
import type { Model, Msg } from './type'

interface Props {
  model: Model
  dispatch: Dispatcher<Msg>
}
export const TagPage: React.FC<Props> = ({ model, dispatch }) => {
  const code = `// Solid Variants
{Tag.view({ variant: 'default', children: 'default' })}
{Tag.view({ variant: 'primary', children: 'conduit' })}
{Tag.view({ variant: 'link', children: 'react' })}
{Tag.view({ variant: 'info', children: 'haskell' })}
{Tag.view({ variant: 'success', children: 'elm' })}
{Tag.view({ variant: 'warning', children: 'fp-ts' })}
{Tag.view({ variant: 'danger', children: 'tea-cup' })}

// Light Variants
{Tag.view({ variant: 'primary', isLight: true, children: 'conduit' })}
{Tag.view({ variant: 'link', isLight: true, children: 'react' })}
{Tag.view({ variant: 'info', isLight: true, children: 'haskell' })}

// Sizes & Shapes
{Tag.view({ size: 'small', children: 'Small Tag' })}
{Tag.view({ size: 'normal', children: 'Normal Tag' })}
{Tag.view({ size: 'medium', children: 'Medium Tag' })}
{Tag.view({ size: 'large', children: 'Large Tag' })}
{Tag.view({ isRounded: true, children: 'Rounded Tag' })}

// Deletable Tags
{Tag.view({ variant: 'primary', onDelete: () => alert('deleted'), children: 'Deletable Tag' })}`
  return (
    <div data-component='TagPage' className='w-full space-y-8 text-left'>
      {Hero.view({
        variant: 'default',
        size: 'small',
        className:
          'rounded-lg bg-gray-50 border border-gray-200 px-6 py-6 w-full',
        children: () => (
          <>
            <div className='mb-1 text-xs font-bold tracking-wider text-green-600 uppercase'>
              ELEMENTS / TAG
            </div>
            {Title.view({
              size: 2,
              className: 'mb-2 font-extrabold text-gray-900',
              children: () => 'Tag',
            })}
            <p className='text-base text-gray-600'>
              Small tag badges for labels, categories, keyword filters, and
              deletable chips.
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
            children: () => (
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
            children: () => (
              <>
                <Code2 className='h-3.5 w-3.5' />
                <span>{model.showCode ? 'Hide Code' : 'Show Code'}</span>
              </>
            ),
          })}
        </div>

        {/* Section 1: Solid Color Variants */}
        {sectionView({
          title: 'Solid Colors',
          children: () => (
            <div className='flex flex-wrap items-center gap-2.5'>
              {Tag.view({ variant: 'default', children: () => 'default' })}
              {Tag.view({ variant: 'primary', children: () => 'conduit' })}
              {Tag.view({ variant: 'link', children: () => 'react' })}
              {Tag.view({ variant: 'info', children: () => 'haskell' })}
              {Tag.view({ variant: 'success', children: () => 'elm' })}
              {Tag.view({ variant: 'warning', children: () => 'fp-ts' })}
              {Tag.view({ variant: 'danger', children: () => 'tea-cup' })}
            </div>
          ),
        })}

        {/* Section 2: Light Color Variants */}
        {sectionView({
          title: 'Light Variants',
          children: () => (
            <div className='flex flex-wrap items-center gap-2.5'>
              {Tag.view({
                variant: 'default',
                isLight: true,
                children: () => 'default',
              })}
              {Tag.view({
                variant: 'primary',
                isLight: true,
                children: () => 'conduit',
              })}
              {Tag.view({
                variant: 'link',
                isLight: true,
                children: () => 'react',
              })}
              {Tag.view({
                variant: 'info',
                isLight: true,
                children: () => 'haskell',
              })}
              {Tag.view({
                variant: 'success',
                isLight: true,
                children: () => 'elm',
              })}
              {Tag.view({
                variant: 'warning',
                isLight: true,
                children: () => 'fp-ts',
              })}
              {Tag.view({
                variant: 'danger',
                isLight: true,
                children: () => 'tea-cup',
              })}
            </div>
          ),
        })}

        {/* Section 3: Sizes & Shapes */}
        {sectionView({
          title: 'Sizes & Shapes',
          children: () => (
            <div className='space-y-4'>
              <div className='flex flex-wrap items-center gap-2.5'>
                {Tag.view({
                  variant: 'primary',
                  size: 'small',
                  children: () => 'Small Tag',
                })}
                {Tag.view({
                  variant: 'primary',
                  size: 'normal',
                  children: () => 'Normal Tag',
                })}
                {Tag.view({
                  variant: 'primary',
                  size: 'medium',
                  children: () => 'Medium Tag',
                })}
                {Tag.view({
                  variant: 'primary',
                  size: 'large',
                  children: () => 'Large Tag',
                })}
              </div>
              <div className='flex flex-wrap items-center gap-2.5 pt-2'>
                {Tag.view({
                  variant: 'info',
                  isRounded: true,
                  size: 'small',
                  children: () => 'Rounded Small',
                })}
                {Tag.view({
                  variant: 'info',
                  isRounded: true,
                  size: 'normal',
                  children: () => 'Rounded Normal',
                })}
                {Tag.view({
                  variant: 'info',
                  isRounded: true,
                  size: 'medium',
                  children: () => 'Rounded Medium',
                })}
                {Tag.view({
                  variant: 'info',
                  isRounded: true,
                  size: 'large',
                  children: () => 'Rounded Large',
                })}
              </div>
            </div>
          ),
        })}

        {/* Section 4: Deletable Chips */}
        {sectionView({
          title: 'Deletable Chips',
          children: () => (
            <div className='flex flex-wrap items-center gap-2.5'>
              {Tag.view({
                variant: 'primary',
                onDelete: () => alert('Deleted conduit tag!'),
                children: () => 'conduit',
              })}
              {Tag.view({
                variant: 'link',
                onDelete: () => alert('Deleted react tag!'),
                children: () => 'react',
              })}
              {Tag.view({
                variant: 'info',
                isLight: true,
                onDelete: () => alert('Deleted haskell tag!'),
                children: () => 'haskell',
              })}
              {Tag.view({
                variant: 'danger',
                onDelete: () => alert('Deleted tea-cup tag!'),
                children: () => 'tea-cup',
              })}
            </div>
          ),
        })}

        {model.showCode && (
          <div className='relative w-full overflow-x-auto rounded-lg border border-gray-800 bg-gray-900 p-5 font-mono text-xs text-gray-100 shadow-lg'>
            <div className='mb-3 flex items-center justify-between border-b border-gray-800 pb-3 font-sans text-xs text-gray-400'>
              <span className='font-semibold text-green-400'>JSX / HTML</span>
              <span className='text-gray-500'>Tag Component Code</span>
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
