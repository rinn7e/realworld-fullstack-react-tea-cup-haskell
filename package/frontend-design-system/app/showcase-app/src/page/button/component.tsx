import { ButtonMemo as DsButtonMemo } from '@rinn7e/realworld-design-system/element/button/component'
import { TitleMemo as DsTitleMemo } from '@rinn7e/realworld-design-system/element/title/component'
import { HeroMemo as DsHeroMemo } from '@rinn7e/realworld-design-system/layout/hero/component'
import {
  Code2,
  Download,
  Heart,
  Plus,
  Send,
  Sparkles,
  Trash2,
} from 'lucide-react'
import { memo } from 'react'

import {
  DEFAULT_SECTION_BOX_CLASS,
  SectionViewMemo,
} from '@/component/section-view'

import { type Props, PropsEq } from './type'

const ButtonPageComponent = ({ model, dispatch }: Props) => {
  const code = `// Solid Style (variant = 'solid')
<DsButtonMemo color='white' variant='solid'>White</DsButtonMemo>
<DsButtonMemo color='green' variant='solid'>Green</DsButtonMemo>

// Outline Style (variant = 'outline')
<DsButtonMemo color='white' variant='outline'>White</DsButtonMemo>
<DsButtonMemo color='green' variant='outline'>Green</DsButtonMemo>

// Link Style (variant = 'link')
<DsButtonMemo color='white' variant='link'>White Link</DsButtonMemo>
<DsButtonMemo color='green' variant='link'>Green Link</DsButtonMemo>

// Sizes & Shapes
<DsButtonMemo size='small'>Small</DsButtonMemo>
<DsButtonMemo size='normal'>Normal</DsButtonMemo>
<DsButtonMemo isRounded={true}>Rounded</DsButtonMemo>

// States & Width
<DsButtonMemo isDisabled={true}>Disabled</DsButtonMemo>
<DsButtonMemo isLoading={true}>Loading</DsButtonMemo>
<DsButtonMemo isFullWidth={true}>Full Width Button</DsButtonMemo>`

  return (
    <div
      data-component='ButtonPage'
      className='flex w-full flex-col gap-8 text-left'
    >
      <DsHeroMemo
        color='gray'
        size='small'
        className='w-full rounded-lg border border-gray-200 bg-gray-50 px-6 py-6 dark:border-zinc-800 dark:bg-zinc-950'
      >
        <div className='pb-1 text-xs font-bold tracking-wider text-green-600 uppercase'>
          ELEMENTS / BUTTON
        </div>
        <DsTitleMemo
          size={2}
          className='pb-2 font-extrabold text-gray-900 dark:text-zinc-100'
        >
          Button
        </DsTitleMemo>
        <p className='text-base text-gray-600 dark:text-zinc-400'>
          Essential button element with support for color palettes (white,
          green, dark-green, sky, amber, red, gray), variants (solid, outline,
          link, ghost), sizes, shapes, and states (loading, disabled).
        </p>
      </DsHeroMemo>

      <div className='flex w-full flex-col gap-6'>
        <div className='flex w-full items-center justify-between'>
          <DsTitleMemo
            size={5}
            className='flex items-center gap-2 font-bold tracking-wider text-gray-600 uppercase dark:text-zinc-400'
          >
            <Sparkles className='h-4 w-4 text-green-600' />
            <span>Interactive Playground &amp; Code</span>
          </DsTitleMemo>
          <DsButtonMemo
            color='green'
            variant='link'
            size='small'
            onClick={() => dispatch({ _tag: 'ToggleShowCode' })}
            className='flex items-center gap-1 font-semibold'
          >
            <Code2 className='h-3.5 w-3.5' />
            <span>{model.showCode ? 'Hide Code' : 'Show Code'}</span>
          </DsButtonMemo>
        </div>

        {/* Section 1: Solid Variant */}
        <SectionViewMemo
          title='Solid Variant (variant = "solid")'
          boxClassName={DEFAULT_SECTION_BOX_CLASS}
        >
          <div className='flex flex-wrap items-center gap-3'>
            <DsButtonMemo color='white' variant='solid'>
              White
            </DsButtonMemo>
            <DsButtonMemo color='green' variant='solid'>
              Green
            </DsButtonMemo>
            <DsButtonMemo color='dark-green' variant='solid'>
              Dark Green
            </DsButtonMemo>
            <DsButtonMemo color='sky' variant='solid'>
              Sky
            </DsButtonMemo>
            <DsButtonMemo color='amber' variant='solid'>
              Amber
            </DsButtonMemo>
            <DsButtonMemo color='red' variant='solid'>
              Red
            </DsButtonMemo>
            <DsButtonMemo color='gray' variant='solid'>
              Gray
            </DsButtonMemo>
          </div>
        </SectionViewMemo>

        {/* Section 2: Outline Variant */}
        <SectionViewMemo
          title='Outline Variant (variant = "outline")'
          boxClassName={DEFAULT_SECTION_BOX_CLASS}
        >
          <div className='flex flex-wrap items-center gap-3'>
            <DsButtonMemo color='white' variant='outline'>
              White
            </DsButtonMemo>
            <DsButtonMemo color='green' variant='outline'>
              Green
            </DsButtonMemo>
            <DsButtonMemo color='dark-green' variant='outline'>
              Dark Green
            </DsButtonMemo>
            <DsButtonMemo color='sky' variant='outline'>
              Sky
            </DsButtonMemo>
            <DsButtonMemo color='amber' variant='outline'>
              Amber
            </DsButtonMemo>
            <DsButtonMemo color='red' variant='outline'>
              Red
            </DsButtonMemo>
            <DsButtonMemo color='gray' variant='outline'>
              Gray
            </DsButtonMemo>
          </div>
        </SectionViewMemo>

        {/* Section 3: Link Variant */}
        <SectionViewMemo
          title='Link Variant (variant = "link")'
          boxClassName={DEFAULT_SECTION_BOX_CLASS}
        >
          <div className='flex flex-wrap items-center gap-3'>
            <DsButtonMemo color='white' variant='link'>
              White
            </DsButtonMemo>
            <DsButtonMemo color='green' variant='link'>
              Green
            </DsButtonMemo>
            <DsButtonMemo color='dark-green' variant='link'>
              Dark Green
            </DsButtonMemo>
            <DsButtonMemo color='sky' variant='link'>
              Sky
            </DsButtonMemo>
            <DsButtonMemo color='amber' variant='link'>
              Amber
            </DsButtonMemo>
            <DsButtonMemo color='red' variant='link'>
              Red
            </DsButtonMemo>
            <DsButtonMemo color='gray' variant='link'>
              Gray
            </DsButtonMemo>
          </div>
        </SectionViewMemo>

        {/* Section 4: Ghost Variant */}
        <SectionViewMemo
          title='Ghost Variant (variant = "ghost")'
          boxClassName={DEFAULT_SECTION_BOX_CLASS}
        >
          <div className='flex flex-wrap items-center gap-3 rounded bg-gray-800 p-4'>
            <DsButtonMemo color='white' variant='ghost'>
              White
            </DsButtonMemo>
            <DsButtonMemo color='green' variant='ghost'>
              Green
            </DsButtonMemo>
            <DsButtonMemo color='dark-green' variant='ghost'>
              Dark Green
            </DsButtonMemo>
            <DsButtonMemo color='sky' variant='ghost'>
              Sky
            </DsButtonMemo>
            <DsButtonMemo color='amber' variant='ghost'>
              Amber
            </DsButtonMemo>
            <DsButtonMemo color='red' variant='ghost'>
              Red
            </DsButtonMemo>
            <DsButtonMemo color='gray' variant='ghost'>
              Gray
            </DsButtonMemo>
          </div>
        </SectionViewMemo>

        {/* Section 5: Sizes */}
        <SectionViewMemo
          title='Button Sizes'
          boxClassName={DEFAULT_SECTION_BOX_CLASS}
        >
          <div className='flex flex-wrap items-center gap-3'>
            <DsButtonMemo color='green' size='xsmall'>
              XSmall (xs)
            </DsButtonMemo>
            <DsButtonMemo color='green' size='small'>
              Small (sm)
            </DsButtonMemo>
            <DsButtonMemo color='green' size='normal'>
              Normal (base)
            </DsButtonMemo>
            <DsButtonMemo color='green' size='medium'>
              Medium (md)
            </DsButtonMemo>
            <DsButtonMemo color='green' size='large'>
              Large (lg)
            </DsButtonMemo>
          </div>
        </SectionViewMemo>

        {/* Section 6: Shapes */}
        <SectionViewMemo
          title='Shapes & Rounded Pill'
          boxClassName={DEFAULT_SECTION_BOX_CLASS}
        >
          <div className='flex flex-wrap items-center gap-3'>
            <DsButtonMemo color='green' isRounded={false}>
              Standard Square
            </DsButtonMemo>
            <DsButtonMemo color='green' isRounded={true}>
              Rounded Pill
            </DsButtonMemo>
            <DsButtonMemo color='sky' variant='outline' isRounded={true}>
              Outline Rounded
            </DsButtonMemo>
          </div>
        </SectionViewMemo>

        {/* Section 7: Icons inside Buttons */}
        <SectionViewMemo
          title='Icons inside Buttons'
          boxClassName={DEFAULT_SECTION_BOX_CLASS}
        >
          <div className='flex flex-wrap items-center gap-3'>
            <DsButtonMemo color='green'>
              <span className='flex items-center gap-1.5'>
                <Plus className='h-4 w-4' />
                <span>New Post</span>
              </span>
            </DsButtonMemo>
            <DsButtonMemo color='sky' variant='outline'>
              <span className='flex items-center gap-1.5'>
                <Download className='h-4 w-4' />
                <span>Download PDF</span>
              </span>
            </DsButtonMemo>
            <DsButtonMemo color='red' variant='solid'>
              <span className='flex items-center gap-1.5'>
                <Trash2 className='h-4 w-4' />
                <span>Delete Account</span>
              </span>
            </DsButtonMemo>
            <DsButtonMemo color='amber'>
              <span className='flex items-center gap-1.5'>
                <Heart className='h-4 w-4 fill-current' />
                <span>Favorite (42)</span>
              </span>
            </DsButtonMemo>
            <DsButtonMemo color='dark-green' isRounded={true}>
              <span className='flex items-center gap-1.5'>
                <Send className='h-4 w-4' />
                <span>Send Message</span>
              </span>
            </DsButtonMemo>
          </div>
        </SectionViewMemo>

        {/* Section 8: Interactive States */}
        <SectionViewMemo
          title='Interactive States (Loading, Disabled, Full Width)'
          boxClassName={DEFAULT_SECTION_BOX_CLASS}
        >
          <div className='flex flex-col gap-4'>
            <div className='flex flex-wrap items-center gap-3'>
              <DsButtonMemo color='green' isLoading={true}>
                Loading State
              </DsButtonMemo>
              <DsButtonMemo color='green' isDisabled={true}>
                Disabled State
              </DsButtonMemo>
              <DsButtonMemo color='red' variant='outline' isDisabled={true}>
                Disabled Outline
              </DsButtonMemo>
            </div>
            <div>
              <DsButtonMemo color='green' isFullWidth={true}>
                Full Width Button Block
              </DsButtonMemo>
            </div>
          </div>
        </SectionViewMemo>

        {model.showCode && (
          <div className='relative flex w-full flex-col gap-3 overflow-x-auto rounded-lg border border-gray-800 bg-gray-900 p-5 font-mono text-xs text-gray-100 shadow-lg'>
            <div className='flex items-center justify-between border-b border-gray-800 pb-3 font-sans text-xs text-gray-400'>
              <span className='font-semibold text-green-400'>JSX / HTML</span>
              <span className='text-gray-500 dark:text-zinc-400'>
                Button Component Code
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

export const ButtonPageMemo = memo(ButtonPageComponent, PropsEq.equals)
