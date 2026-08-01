import { Button, Hero, Title } from '@rinn7e/realworld-design-system'
import {
  Code2,
  Download,
  Heart,
  Plus,
  Send,
  Sparkles,
  Trash2,
} from 'lucide-react'
import React from 'react'
import type { Dispatcher } from 'tea-cup-fp'

import { sectionView } from '../../component/section-view'
import type { Model, Msg } from './type'

interface Props {
  model: Model
  dispatch: Dispatcher<Msg>
}
export const ButtonPage: React.FC<Props> = ({ model, dispatch }) => {
  const code = `// Solid Style (variant = 'solid')
{Button.view({ color: 'white', variant: 'solid', children: () => 'White' })}
{Button.view({ color: 'green', variant: 'solid', children: () => 'Green' })}
{Button.view({ color: 'dark-green', variant: 'solid', children: () => 'Dark Green' })}
{Button.view({ color: 'sky', variant: 'solid', children: () => 'Sky' })}
{Button.view({ color: 'amber', variant: 'solid', children: () => 'Amber' })}
{Button.view({ color: 'red', variant: 'solid', children: () => 'Red' })}

// Outline Style (variant = 'outline')
{Button.view({ color: 'white', variant: 'outline', children: () => 'White' })}
{Button.view({ color: 'green', variant: 'outline', children: () => 'Green' })}
{Button.view({ color: 'dark-green', variant: 'outline', children: () => 'Dark Green' })}
{Button.view({ color: 'sky', variant: 'outline', children: () => 'Sky' })}
{Button.view({ color: 'amber', variant: 'outline', children: () => 'Amber' })}
{Button.view({ color: 'red', variant: 'outline', children: () => 'Red' })}

// Link Style (variant = 'link')
{Button.view({ color: 'white', variant: 'link', children: () => 'White Link' })}
{Button.view({ color: 'green', variant: 'link', children: () => 'Green Link' })}
{Button.view({ color: 'dark-green', variant: 'link', children: () => 'Dark Green Link' })}
{Button.view({ color: 'sky', variant: 'link', children: () => 'Sky Link' })}
{Button.view({ color: 'amber', variant: 'link', children: () => 'Amber Link' })}
{Button.view({ color: 'red', variant: 'link', children: () => 'Red Link' })}

// Sizes & Shapes
{Button.view({ size: 'small', children: () => 'Small' })}
{Button.view({ size: 'normal', children: () => 'Normal' })}
{Button.view({ size: 'medium', children: () => 'Medium' })}
{Button.view({ size: 'large', children: () => 'Large' })}
{Button.view({ isRounded: true, children: () => 'Rounded' })}

// States & Width
{Button.view({ isDisabled: true, children: () => 'Disabled' })}
{Button.view({ isLoading: true, children: () => 'Loading' })}
{Button.view({ isFullWidth: true, children: () => 'Full Width Button' })}`
  return (
    <div data-component='ButtonPage' className='w-full space-y-8 text-left'>
      {Hero.view({
        variant: 'default',
        size: 'small',
        className:
          'rounded-lg bg-gray-50 border border-gray-200 px-6 py-6 w-full',
        children: () => (
          <>
            <div className='mb-1 text-xs font-bold tracking-wider text-green-600 uppercase'>
              ELEMENTS / BUTTON
            </div>
            {Title.view({
              size: 2,
              className: 'mb-2 font-extrabold text-gray-900',
              children: () => 'Button',
            })}
            <p className='text-base text-gray-600'>
              Essential button element with support for color palettes (white,
              green, dark-green, sky, amber, red, gray), variants (solid,
              outline, link, ghost), sizes, shapes, and states (loading,
              disabled).
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
            color: 'green',
            variant: 'link',
            size: 'small',
            onClick: () => dispatch({ _tag: 'ToggleShowCode' }),
            className: 'flex items-center gap-1 font-semibold',
            children: () => (
              <>
                <Code2 className='h-3.5 w-3.5' />
                <span>{model.showCode ? 'Hide Code' : 'Show Code'}</span>
              </>
            ),
          })}
        </div>

        {/* Section 1: Solid Variant */}
        {sectionView({
          title: 'Solid Variant (variant = "solid")',
          children: () => (
            <div className='flex flex-wrap items-center gap-3'>
              {Button.view({
                color: 'white',
                variant: 'solid',
                children: () => 'White',
              })}
              {Button.view({
                color: 'green',
                variant: 'solid',
                children: () => 'Green',
              })}
              {Button.view({
                color: 'dark-green',
                variant: 'solid',
                children: () => 'Dark Green',
              })}
              {Button.view({
                color: 'sky',
                variant: 'solid',
                children: () => 'Sky',
              })}
              {Button.view({
                color: 'amber',
                variant: 'solid',
                children: () => 'Amber',
              })}
              {Button.view({
                color: 'red',
                variant: 'solid',
                children: () => 'Red',
              })}
              {Button.view({
                color: 'gray',
                variant: 'solid',
                children: () => 'Gray',
              })}
            </div>
          ),
        })}

        {/* Section 2: Outline Variant */}
        {sectionView({
          title: 'Outline Variant (variant = "outline")',
          children: () => (
            <div className='flex flex-wrap items-center gap-3'>
              {Button.view({
                color: 'white',
                variant: 'outline',
                children: () => 'White',
              })}
              {Button.view({
                color: 'green',
                variant: 'outline',
                children: () => 'Green',
              })}
              {Button.view({
                color: 'dark-green',
                variant: 'outline',
                children: () => 'Dark Green',
              })}
              {Button.view({
                color: 'sky',
                variant: 'outline',
                children: () => 'Sky',
              })}
              {Button.view({
                color: 'amber',
                variant: 'outline',
                children: () => 'Amber',
              })}
              {Button.view({
                color: 'red',
                variant: 'outline',
                children: () => 'Red',
              })}
              {Button.view({
                color: 'gray',
                variant: 'outline',
                children: () => 'Gray',
              })}
            </div>
          ),
        })}

        {/* Section 3: Link Variant */}
        {sectionView({
          title: 'Link Variant (variant = "link")',
          children: () => (
            <div className='flex flex-wrap items-center gap-4'>
              {Button.view({
                color: 'white',
                variant: 'link',
                children: () => 'White Link',
              })}
              {Button.view({
                color: 'green',
                variant: 'link',
                children: () => 'Green Link',
              })}
              {Button.view({
                color: 'dark-green',
                variant: 'link',
                children: () => 'Dark Green Link',
              })}
              {Button.view({
                color: 'sky',
                variant: 'link',
                children: () => 'Sky Link',
              })}
              {Button.view({
                color: 'amber',
                variant: 'link',
                children: () => 'Amber Link',
              })}
              {Button.view({
                color: 'red',
                variant: 'link',
                children: () => 'Red Link',
              })}
              {Button.view({
                color: 'gray',
                variant: 'link',
                children: () => 'Gray Link',
              })}
            </div>
          ),
        })}

        {/* Section 3b: Ghost Variant */}
        {sectionView({
          title: 'Ghost Variant (variant = "ghost")',
          children: () => (
            <div className='flex flex-wrap items-center gap-4'>
              {Button.view({
                color: 'green',
                variant: 'ghost',
                children: () => 'Green Ghost',
              })}
              {Button.view({
                color: 'dark-green',
                variant: 'ghost',
                children: () => 'Dark Green Ghost',
              })}
              {Button.view({
                color: 'sky',
                variant: 'ghost',
                children: () => 'Sky Ghost',
              })}
              {Button.view({
                color: 'amber',
                variant: 'ghost',
                children: () => 'Amber Ghost',
              })}
              {Button.view({
                color: 'red',
                variant: 'ghost',
                children: () => 'Red Ghost',
              })}
              {Button.view({
                color: 'gray',
                variant: 'ghost',
                children: () => 'Gray Ghost',
              })}
            </div>
          ),
        })}

        {/* Section 4: Sizes & Shapes */}
        {sectionView({
          title: 'Sizes & Shapes',
          children: () => (
            <div className='space-y-4'>
              <div className='flex flex-wrap items-center gap-3'>
                {Button.view({
                  color: 'green',
                  size: 'xsmall',
                  children: () => 'XSmall',
                })}
                {Button.view({
                  color: 'green',
                  size: 'small',
                  children: () => 'Small',
                })}
                {Button.view({
                  color: 'green',
                  size: 'normal',
                  children: () => 'Normal',
                })}
                {Button.view({
                  color: 'green',
                  size: 'medium',
                  children: () => 'Medium',
                })}
                {Button.view({
                  color: 'green',
                  size: 'large',
                  children: () => 'Large',
                })}
              </div>
              <div className='flex flex-wrap items-center gap-3 pt-2'>
                {Button.view({
                  color: 'green',
                  isRounded: true,
                  size: 'small',
                  children: () => 'Rounded Small',
                })}
                {Button.view({
                  color: 'green',
                  isRounded: true,
                  size: 'normal',
                  children: () => 'Rounded Normal',
                })}
                {Button.view({
                  color: 'green',
                  isRounded: true,
                  size: 'medium',
                  children: () => 'Rounded Medium',
                })}
                {Button.view({
                  color: 'green',
                  isRounded: true,
                  size: 'large',
                  children: () => 'Rounded Large',
                })}
              </div>
            </div>
          ),
        })}

        {/* Section 5: Buttons with Icons */}
        {sectionView({
          title: 'Buttons with Icons',
          children: () => (
            <div className='flex flex-wrap items-center gap-3'>
              {Button.view({
                color: 'green',
                size: 'small',
                children: () => (
                  <span className='flex items-center gap-1.5'>
                    <Heart size={14} />
                    <span>Favorite (12)</span>
                  </span>
                ),
              })}
              {Button.view({
                color: 'dark-green',
                size: 'small',
                children: () => (
                  <span className='flex items-center gap-1.5'>
                    <Plus size={14} />
                    <span>Follow Author</span>
                  </span>
                ),
              })}
              {Button.view({
                color: 'sky',
                variant: 'outline',
                size: 'small',
                children: () => (
                  <span className='flex items-center gap-1.5'>
                    <Download size={14} />
                    <span>Download</span>
                  </span>
                ),
              })}
              {Button.view({
                color: 'amber',
                variant: 'outline',
                size: 'small',
                children: () => (
                  <span className='flex items-center gap-1.5'>
                    <Send size={14} />
                    <span>Send Message</span>
                  </span>
                ),
              })}
              {Button.view({
                color: 'red',
                variant: 'outline',
                size: 'small',
                children: () => (
                  <span className='flex items-center gap-1.5'>
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </span>
                ),
              })}
            </div>
          ),
        })}

        {/* Section 6: States & Width */}
        {sectionView({
          title: 'States & Width',
          children: () => (
            <div className='w-full space-y-4'>
              <div className='flex flex-wrap items-center gap-3'>
                {Button.view({
                  color: 'green',
                  isDisabled: true,
                  children: () => 'Disabled Button',
                })}
                {Button.view({
                  color: 'red',
                  isLoading: model.isLoading,
                  onClick: () => dispatch({ _tag: 'ToggleLoading' }),
                  children: () =>
                    model.isLoading
                      ? 'Processing...'
                      : 'Click to Toggle Loading',
                })}
              </div>
              <div className='pt-2'>
                {Button.view({
                  color: 'green',
                  isFullWidth: true,
                  children: () => 'Full Width Button',
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
