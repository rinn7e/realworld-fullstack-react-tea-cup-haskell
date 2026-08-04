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
  const code = `// Color Variants (solid, outline)
<DsTagMemo color="green" variant="solid">green</DsTagMemo>
<DsTagMemo color="green" variant="outline">green</DsTagMemo>

// Sizes & Shapes
<DsTagMemo color="green" size="small">Small</DsTagMemo>
<DsTagMemo color="sky" isRounded={true}>Rounded</DsTagMemo>

// Clickable (hover state)
<DsTagMemo color="green" onClick={() => ...}>click me</DsTagMemo>

// Deletable
<DsTagMemo color="green" onDelete={() => ...}>conduit</DsTagMemo>`

  return (
    <div data-component='TagPage' className='w-full space-y-8 text-left'>
      <DsHeroMemo
        color='gray'
        size='small'
        className='w-full rounded-lg border border-gray-200 bg-gray-50 px-6 py-6 dark:border-zinc-800 dark:bg-zinc-950'
      >
        <>
          <div className='mb-1 text-xs font-bold tracking-wider text-green-600 uppercase'>
            ELEMENTS / TAG
          </div>
          <DsTitleMemo
            size={2}
            className='mb-2 font-extrabold text-gray-900 dark:text-zinc-100'
          >
            Tag
          </DsTitleMemo>
          <p className='text-base text-gray-600 dark:text-zinc-400'>
            Small tag badges for labels, categories, keyword filters, and
            deletable chips.
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

        {/* Section 1: Color Variants */}
        {sectionView({
          title: 'Color Variants',
          children: () => (
            <div className='space-y-4'>
              <div>
                <div className='mb-2 text-xs font-semibold tracking-wider text-gray-400 uppercase'>
                  Solid
                </div>
                <div className='flex flex-wrap items-center gap-2.5'>
                  <DsTagMemo color='white'>white</DsTagMemo>
                  <DsTagMemo color='green'>green</DsTagMemo>
                  <DsTagMemo color='dark-green'>dark-green</DsTagMemo>
                  <DsTagMemo color='sky'>sky</DsTagMemo>
                  <DsTagMemo color='amber'>amber</DsTagMemo>
                  <DsTagMemo color='red'>red</DsTagMemo>
                  <DsTagMemo color='gray'>gray</DsTagMemo>
                </div>
              </div>

              <div>
                <div className='mb-2 text-xs font-semibold tracking-wider text-gray-400 uppercase'>
                  Outline
                </div>
                <div className='flex flex-wrap items-center gap-2.5'>
                  <DsTagMemo color='white' variant='outline'>
                    white
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
                  <DsTagMemo color='gray' variant='outline'>
                    gray
                  </DsTagMemo>
                </div>
              </div>
            </div>
          ),
        })}

        {/* Section 2: Sizes & Shapes */}
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

        {/* Section 3: Deletable Chips */}
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

        {/* Section 4: Clickable Tags (with Hover States) */}
        {sectionView({
          title: 'Clickable Tags (Hover State)',
          children: () => (
            <div className='space-y-3'>
              <p className='text-xs text-gray-500 dark:text-zinc-400'>
                Hover states are only applied when a tag has an{' '}
                <code className='rounded bg-gray-100 px-1 py-0.5 font-mono'>
                  onClick
                </code>{' '}
                handler. Try hovering!
              </p>
              <div className='flex flex-wrap items-center gap-2.5'>
                <DsTagMemo color='white' onClick={() => alert('clicked white')}>
                  white
                </DsTagMemo>
                <DsTagMemo color='green' onClick={() => alert('clicked green')}>
                  green
                </DsTagMemo>
                <DsTagMemo
                  color='dark-green'
                  onClick={() => alert('clicked dark-green')}
                >
                  dark-green
                </DsTagMemo>
                <DsTagMemo color='sky' onClick={() => alert('clicked sky')}>
                  sky
                </DsTagMemo>
                <DsTagMemo color='amber' onClick={() => alert('clicked amber')}>
                  amber
                </DsTagMemo>
                <DsTagMemo
                  color='red'
                  variant='outline'
                  onClick={() => alert('clicked red')}
                >
                  red
                </DsTagMemo>
                <DsTagMemo color='gray' onClick={() => alert('clicked gray')}>
                  gray
                </DsTagMemo>
              </div>
            </div>
          ),
        })}

        {model.showCode && (
          <div className='relative w-full overflow-x-auto rounded-lg border border-gray-800 bg-gray-900 p-5 font-mono text-xs text-gray-100 shadow-lg'>
            <div className='mb-3 flex items-center justify-between border-b border-gray-800 pb-3 font-sans text-xs text-gray-400'>
              <span className='font-semibold text-green-400'>JSX / HTML</span>
              <span className='text-gray-500 dark:text-zinc-400'>
                Tag Component Code
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
