import { ButtonMemo as DsButtonMemo } from '@rinn7e/realworld-design-system/element/button/component'
import { TagMemo as DsTagMemo } from '@rinn7e/realworld-design-system/element/tag/component'
import { TitleMemo as DsTitleMemo } from '@rinn7e/realworld-design-system/element/title/component'
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

export const TagPage: React.FC<Props> = ({ model, dispatch }) => {
  const code = `// Solid Colors
<DsTagMemo color="gray">gray</DsTagMemo>
<DsTagMemo color="green">green</DsTagMemo>

// Light Variants
<DsTagMemo color="gray" variant="light">gray</DsTagMemo>
<DsTagMemo color="green" variant="light">green</DsTagMemo>

// Outline Variants
<DsTagMemo color="gray" variant="outline">gray</DsTagMemo>
<DsTagMemo color="green" variant="outline">green</DsTagMemo>

// Clickable (hover state)
<DsTagMemo color="green" variant="light" onClick={() => ...} >click me</DsTagMemo>

// Deletable
<DsTagMemo color="green" onDelete={() => ...} >conduit</DsTagMemo>`

  return (
    <div data-component='TagPage' className='w-full space-y-8 text-left'>
      <DsHeroMemo
        variant='default'
        size='small'
        className='w-full rounded-lg border border-gray-200 bg-gray-50 px-6 py-6'
      >
        <>
          <div className='mb-1 text-xs font-bold tracking-wider text-green-600 uppercase'>
            ELEMENTS / TAG
          </div>
          <DsTitleMemo size={2} className='mb-2 font-extrabold text-gray-900'>
            Tag
          </DsTitleMemo>
          <p className='text-base text-gray-600'>
            Small tag badges for labels, categories, keyword filters, and
            deletable chips.
          </p>
        </>
      </DsHeroMemo>

      <div className='flex w-full flex-col gap-6'>
        <div className='flex w-full items-center justify-between'>
          <DsTitleMemo
            size={5}
            className='flex items-center gap-2 font-bold tracking-wider text-gray-600 uppercase'
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

        {/* Section 1: Solid Colors */}
        {sectionView({
          title: 'Solid Colors',
          children: () => (
            <div className='flex flex-wrap items-center gap-2.5'>
              <DsTagMemo color='gray'>gray</DsTagMemo>
              <DsTagMemo color='green'>green</DsTagMemo>
              <DsTagMemo color='dark-green'>dark-green</DsTagMemo>
              <DsTagMemo color='sky'>sky</DsTagMemo>
              <DsTagMemo color='amber'>amber</DsTagMemo>
              <DsTagMemo color='red'>red</DsTagMemo>
            </div>
          ),
        })}

        {/* Section 2: Light Variants */}
        {sectionView({
          title: 'Light Variants',
          children: () => (
            <div className='flex flex-wrap items-center gap-2.5'>
              <DsTagMemo color='gray' variant='light'>
                gray
              </DsTagMemo>
              <DsTagMemo color='green' variant='light'>
                green
              </DsTagMemo>
              <DsTagMemo color='dark-green' variant='light'>
                dark-green
              </DsTagMemo>
              <DsTagMemo color='sky' variant='light'>
                sky
              </DsTagMemo>
              <DsTagMemo color='amber' variant='light'>
                amber
              </DsTagMemo>
              <DsTagMemo color='red' variant='light'>
                red
              </DsTagMemo>
            </div>
          ),
        })}

        {/* Section 3: Outline Variants */}
        {sectionView({
          title: 'Outline Variants',
          children: () => (
            <div className='flex flex-wrap items-center gap-2.5'>
              <DsTagMemo color='gray' variant='outline'>
                gray
              </DsTagMemo>
              <DsTagMemo color='green' variant='outline'>
                green
              </DsTagMemo>
              <DsTagMemo color='dark-green' variant='outline'>
                dark-green
              </DsTagMemo>
              <DsTagMemo color='sky' variant='outline'>
                sky
              </DsTagMemo>
              <DsTagMemo color='amber' variant='outline'>
                amber
              </DsTagMemo>
              <DsTagMemo color='red' variant='outline'>
                red
              </DsTagMemo>
            </div>
          ),
        })}

        {/* Section 4: Sizes & Shapes */}
        {sectionView({
          title: 'Sizes & Shapes',
          children: () => (
            <div className='space-y-4'>
              <div className='flex flex-wrap items-center gap-2.5'>
                <DsTagMemo color='green' size='small'>
                  Small Tag
                </DsTagMemo>
                <DsTagMemo color='green' size='normal'>
                  Normal Tag
                </DsTagMemo>
                <DsTagMemo color='green' size='medium'>
                  Medium Tag
                </DsTagMemo>
                <DsTagMemo color='green' size='large'>
                  Large Tag
                </DsTagMemo>
              </div>
              <div className='flex flex-wrap items-center gap-2.5 pt-2'>
                <DsTagMemo color='sky' isRounded={true} size='small'>
                  Rounded Small
                </DsTagMemo>
                <DsTagMemo color='sky' isRounded={true} size='normal'>
                  Rounded Normal
                </DsTagMemo>
                <DsTagMemo color='sky' isRounded={true} size='medium'>
                  Rounded Medium
                </DsTagMemo>
                <DsTagMemo color='sky' isRounded={true} size='large'>
                  Rounded Large
                </DsTagMemo>
              </div>
            </div>
          ),
        })}

        {/* Section 5: Deletable Chips */}
        {sectionView({
          title: 'Deletable Chips',
          children: () => (
            <div className='flex flex-wrap items-center gap-2.5'>
              <DsTagMemo
                color='green'
                onDelete={() => alert('Deleted conduit tag!')}
              >
                conduit
              </DsTagMemo>
              <DsTagMemo
                color='dark-green'
                onDelete={() => alert('Deleted react tag!')}
              >
                react
              </DsTagMemo>
              <DsTagMemo
                color='sky'
                variant='light'
                onDelete={() => alert('Deleted haskell tag!')}
              >
                haskell
              </DsTagMemo>
              <DsTagMemo
                color='red'
                onDelete={() => alert('Deleted tea-cup tag!')}
              >
                tea-cup
              </DsTagMemo>
            </div>
          ),
        })}

        {/* Section 6: Clickable Tags (with Hover States) */}
        {sectionView({
          title: 'Clickable Tags (Hover State)',
          children: () => (
            <div className='space-y-3'>
              <p className='text-xs text-gray-500'>
                Hover states are only applied when a tag has an{' '}
                <code className='rounded bg-gray-100 px-1 py-0.5 font-mono'>
                  onClick
                </code>{' '}
                handler. Try hovering!
              </p>
              <div className='flex flex-wrap items-center gap-2.5'>
                <DsTagMemo
                  color='gray'
                  variant='light'
                  onClick={() => alert('clicked gray')}
                >
                  gray
                </DsTagMemo>
                <DsTagMemo color='green' onClick={() => alert('clicked green')}>
                  green
                </DsTagMemo>
                <DsTagMemo
                  color='dark-green'
                  variant='light'
                  onClick={() => alert('clicked dark-green')}
                >
                  dark-green
                </DsTagMemo>
                <DsTagMemo color='sky' onClick={() => alert('clicked sky')}>
                  sky
                </DsTagMemo>
                <DsTagMemo
                  color='amber'
                  variant='light'
                  onClick={() => alert('clicked amber')}
                >
                  amber
                </DsTagMemo>
                <DsTagMemo
                  color='red'
                  variant='outline'
                  onClick={() => alert('clicked red')}
                >
                  red
                </DsTagMemo>
              </div>
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
