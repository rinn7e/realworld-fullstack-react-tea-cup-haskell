import { HeroMemo as DsHeroMemo } from '@rinn7e/realworld-design-system/layout/hero/component'
import { ButtonMemo as DsButtonMemo } from '@rinn7e/realworld-design-system/element/button/component'
import { TitleMemo as DsTitleMemo } from '@rinn7e/realworld-design-system/element/title/component'
import {
  Code2,
  Download,
  Heart,
  Plus,
  Send,
  Sparkles,
  Trash2 } from 'lucide-react'
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
<DsButtonMemo color='white' variant='solid' children={() => 'White'} />
<DsButtonMemo color='green' variant='solid' children={() => 'Green'} />

// Outline Style (variant = 'outline')
<DsButtonMemo color='white' variant='outline' children={() => 'White'} />
<DsButtonMemo color='green' variant='outline' children={() => 'Green'} />

// Link Style (variant = 'link')
<DsButtonMemo color='white' variant='link' children={() => 'White Link'} />
<DsButtonMemo color='green' variant='link' children={() => 'Green Link'} />

// Sizes & Shapes
<DsButtonMemo size='small' children={() => 'Small'} />
<DsButtonMemo size='normal' children={() => 'Normal'} />
<DsButtonMemo isRounded={true} children={() => 'Rounded'} />

// States & Width
<DsButtonMemo isDisabled={true} children={() => 'Disabled'} />
<DsButtonMemo isLoading={true} children={() => 'Loading'} />
<DsButtonMemo isFullWidth={true} children={() => 'Full Width Button'} />`

  return (
    <div data-component='ButtonPage' className='w-full space-y-8 text-left'>
      <DsHeroMemo variant="default" size="small" className="rounded-lg bg-gray-50 border border-gray-200 px-6 py-6 w-full" children={() => (<><div className='mb-1 text-xs font-bold tracking-wider text-green-600 uppercase'>
              ELEMENTS / BUTTON
            </div>
            <DsTitleMemo
              size={2}
              className='mb-2 font-extrabold text-gray-900'
              children={() => 'Button'}
            />
            <p className='text-base text-gray-600'>
              Essential button element with support for color palettes (white,
              green, dark-green, sky, amber, red, gray), variants (solid,
              outline, link, ghost), sizes, shapes, and states (loading,
              disabled).
            </p></>)} />

      <div className='flex w-full flex-col gap-6'>
        <div className='flex w-full items-center justify-between'>
          <DsTitleMemo
            size={5}
            className='flex items-center gap-2 font-bold uppercase tracking-wider text-gray-600'
            children={() => (
              <>
                <Sparkles className='h-4 w-4 text-green-600' />
                <span>Interactive Playground &amp; Code</span>
              </>
            )}
          />
          <DsButtonMemo
            color='green'
            variant='link'
            size='small'
            onClick={() => dispatch({ _tag: 'ToggleShowCode' })}
            className='flex items-center gap-1 font-semibold'
            children={() => (
              <>
                <Code2 className='h-3.5 w-3.5' />
                <span>{model.showCode ? 'Hide Code' : 'Show Code'}</span>
              </>
            )}
          />
        </div>

        {/* Section 1: Solid Variant */}
        {sectionView({
          title: 'Solid Variant (variant = "solid")',
          children: () => (
            <div className='flex flex-wrap items-center gap-3'>
              <DsButtonMemo color='white' variant='solid' children={() => 'White'} />
              <DsButtonMemo color='green' variant='solid' children={() => 'Green'} />
              <DsButtonMemo
                color='dark-green'
                variant='solid'
                children={() => 'Dark Green'}
              />
              <DsButtonMemo color='sky' variant='solid' children={() => 'Sky'} />
              <DsButtonMemo color='amber' variant='solid' children={() => 'Amber'} />
              <DsButtonMemo color='red' variant='solid' children={() => 'Red'} />
              <DsButtonMemo color='gray' variant='solid' children={() => 'Gray'} />
            </div>
          ) })}

        {/* Section 2: Outline Variant */}
        {sectionView({
          title: 'Outline Variant (variant = "outline")',
          children: () => (
            <div className='flex flex-wrap items-center gap-3'>
              <DsButtonMemo color='white' variant='outline' children={() => 'White'} />
              <DsButtonMemo color='green' variant='outline' children={() => 'Green'} />
              <DsButtonMemo
                color='dark-green'
                variant='outline'
                children={() => 'Dark Green'}
              />
              <DsButtonMemo color='sky' variant='outline' children={() => 'Sky'} />
              <DsButtonMemo color='amber' variant='outline' children={() => 'Amber'} />
              <DsButtonMemo color='red' variant='outline' children={() => 'Red'} />
              <DsButtonMemo color='gray' variant='outline' children={() => 'Gray'} />
            </div>
          ) })}

        {/* Section 3: Link Variant */}
        {sectionView({
          title: 'Link Variant (variant = "link")',
          children: () => (
            <div className='flex flex-wrap items-center gap-3'>
              <DsButtonMemo color='white' variant='link' children={() => 'White'} />
              <DsButtonMemo color='green' variant='link' children={() => 'Green'} />
              <DsButtonMemo
                color='dark-green'
                variant='link'
                children={() => 'Dark Green'}
              />
              <DsButtonMemo color='sky' variant='link' children={() => 'Sky'} />
              <DsButtonMemo color='amber' variant='link' children={() => 'Amber'} />
              <DsButtonMemo color='red' variant='link' children={() => 'Red'} />
              <DsButtonMemo color='gray' variant='link' children={() => 'Gray'} />
            </div>
          ) })}

        {/* Section 4: Ghost Variant */}
        {sectionView({
          title: 'Ghost Variant (variant = "ghost")',
          children: () => (
            <div className='flex flex-wrap items-center gap-3 rounded bg-gray-800 p-4'>
              <DsButtonMemo color='white' variant='ghost' children={() => 'White'} />
              <DsButtonMemo color='green' variant='ghost' children={() => 'Green'} />
              <DsButtonMemo
                color='dark-green'
                variant='ghost'
                children={() => 'Dark Green'}
              />
              <DsButtonMemo color='sky' variant='ghost' children={() => 'Sky'} />
              <DsButtonMemo color='amber' variant='ghost' children={() => 'Amber'} />
              <DsButtonMemo color='red' variant='ghost' children={() => 'Red'} />
              <DsButtonMemo color='gray' variant='ghost' children={() => 'Gray'} />
            </div>
          ) })}

        {/* Section 5: Sizes */}
        {sectionView({
          title: 'Button Sizes',
          children: () => (
            <div className='flex flex-wrap items-center gap-3'>
              <DsButtonMemo
                color='green'
                size='xsmall'
                children={() => 'XSmall (xs)'}
              />
              <DsButtonMemo
                color='green'
                size='small'
                children={() => 'Small (sm)'}
              />
              <DsButtonMemo
                color='green'
                size='normal'
                children={() => 'Normal (base)'}
              />
              <DsButtonMemo
                color='green'
                size='medium'
                children={() => 'Medium (md)'}
              />
              <DsButtonMemo
                color='green'
                size='large'
                children={() => 'Large (lg)'}
              />
            </div>
          ) })}

        {/* Section 6: Shapes */}
        {sectionView({
          title: 'Shapes & Rounded Pill',
          children: () => (
            <div className='flex flex-wrap items-center gap-3'>
              <DsButtonMemo
                color='green'
                isRounded={false}
                children={() => 'Standard Square'}
              />
              <DsButtonMemo
                color='green'
                isRounded={true}
                children={() => 'Rounded Pill'}
              />
              <DsButtonMemo
                color='sky'
                variant='outline'
                isRounded={true}
                children={() => 'Outline Rounded'}
              />
            </div>
          ) })}

        {/* Section 7: Icons inside Buttons */}
        {sectionView({
          title: 'Icons inside Buttons',
          children: () => (
            <div className='flex flex-wrap items-center gap-3'>
              <DsButtonMemo
                color='green'
                children={() => (
                  <span className='flex items-center gap-1.5'>
                    <Plus className='h-4 w-4' />
                    <span>New Post</span>
                  </span>
                )}
              />
              <DsButtonMemo
                color='sky'
                variant='outline'
                children={() => (
                  <span className='flex items-center gap-1.5'>
                    <Download className='h-4 w-4' />
                    <span>Download PDF</span>
                  </span>
                )}
              />
              <DsButtonMemo
                color='red'
                variant='solid'
                children={() => (
                  <span className='flex items-center gap-1.5'>
                    <Trash2 className='h-4 w-4' />
                    <span>Delete Account</span>
                  </span>
                )}
              />
              <DsButtonMemo
                color='amber'
                children={() => (
                  <span className='flex items-center gap-1.5'>
                    <Heart className='h-4 w-4 fill-current' />
                    <span>Favorite (42)</span>
                  </span>
                )}
              />
              <DsButtonMemo
                color='dark-green'
                isRounded={true}
                children={() => (
                  <span className='flex items-center gap-1.5'>
                    <Send className='h-4 w-4' />
                    <span>Send Message</span>
                  </span>
                )}
              />
            </div>
          ) })}

        {/* Section 8: Interactive States */}
        {sectionView({
          title: 'Interactive States (Loading, Disabled, Full Width)',
          children: () => (
            <div className='space-y-4'>
              <div className='flex flex-wrap items-center gap-3'>
                <DsButtonMemo
                  color='green'
                  isLoading={true}
                  children={() => 'Loading State'}
                />
                <DsButtonMemo
                  color='green'
                  isDisabled={true}
                  children={() => 'Disabled State'}
                />
                <DsButtonMemo
                  color='red'
                  variant='outline'
                  isDisabled={true}
                  children={() => 'Disabled Outline'}
                />
              </div>
              <div>
                <DsButtonMemo
                  color='green'
                  isFullWidth={true}
                  children={() => 'Full Width Button Block'}
                />
              </div>
            </div>
          ) })}

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
