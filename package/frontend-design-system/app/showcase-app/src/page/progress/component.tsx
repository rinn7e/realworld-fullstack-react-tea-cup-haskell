import { ButtonMemo as DsButtonMemo } from '@rinn7e/realworld-design-system/element/button/component'
import { ProgressMemo as DsProgressMemo } from '@rinn7e/realworld-design-system/element/progress/component'
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

export const ProgressPage: React.FC<Props> = ({ model, dispatch }) => {
  const code = `// Standard Progress Bar (Determinate)
<DsProgressMemo value={60} max={100} variant='primary' />

// Color Variants
<DsProgressMemo value={30} variant='primary' />
<DsProgressMemo value={45} variant='link' />
<DsProgressMemo value={60} variant='info' />
<DsProgressMemo value={75} variant='success' />
<DsProgressMemo value={90} variant='warning' />
<DsProgressMemo value={100} variant='danger' />

// Sizes
<DsProgressMemo value={50} size='xsmall' />
<DsProgressMemo value={50} size='small' />
<DsProgressMemo value={50} size='normal' />
<DsProgressMemo value={50} size='medium' />
<DsProgressMemo value={50} size='large' />

// Indeterminate Progress Bar
<DsProgressMemo isIndeterminate={true} variant='primary' />`

  return (
    <div data-component='ProgressPage' className='w-full space-y-8 text-left'>
      <DsHeroMemo
        variant='default'
        size='small'
        className='w-full rounded-lg border border-gray-200 bg-gray-50 px-6 py-6 dark:border-zinc-800 dark:bg-zinc-950'
      >
        <>
          <div className='mb-1 text-xs font-bold tracking-wider text-green-600 uppercase'>
            ELEMENTS / PROGRESS
          </div>
          <DsTitleMemo
            size={2}
            className='mb-2 font-extrabold text-gray-900 dark:text-zinc-100'
          >
            Progress
          </DsTitleMemo>
          <p className='text-base text-gray-600 dark:text-zinc-400'>
            Standard progress bars with support for different color variants,
            sizes, values, and indeterminate loading states.
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
            <div className='w-full space-y-4'>
              <div>
                <span className='mb-1 block text-xs font-medium text-gray-500 dark:text-zinc-400'>
                  Primary (30%)
                </span>
                <DsProgressMemo value={30} max={100} variant='primary' />
              </div>
              <div>
                <span className='mb-1 block text-xs font-medium text-gray-500 dark:text-zinc-400'>
                  Link (45%)
                </span>
                <DsProgressMemo value={45} max={100} variant='link' />
              </div>
              <div>
                <span className='mb-1 block text-xs font-medium text-gray-500 dark:text-zinc-400'>
                  Info (60%)
                </span>
                <DsProgressMemo value={60} max={100} variant='info' />
              </div>
              <div>
                <span className='mb-1 block text-xs font-medium text-gray-500 dark:text-zinc-400'>
                  Success (75%)
                </span>
                <DsProgressMemo value={75} max={100} variant='success' />
              </div>
              <div>
                <span className='mb-1 block text-xs font-medium text-gray-500 dark:text-zinc-400'>
                  Warning (90%)
                </span>
                <DsProgressMemo value={90} max={100} variant='warning' />
              </div>
              <div>
                <span className='mb-1 block text-xs font-medium text-gray-500 dark:text-zinc-400'>
                  Danger (100%)
                </span>
                <DsProgressMemo value={100} max={100} variant='danger' />
              </div>
            </div>
          ),
        })}

        {/* Section 2: Sizes */}
        {sectionView({
          title: 'Sizes',
          children: () => (
            <div className='w-full space-y-4'>
              <div>
                <span className='mb-1 block text-xs font-medium text-gray-500 dark:text-zinc-400'>
                  Very small
                </span>
                <DsProgressMemo value={50} size='xsmall' variant='primary' />
              </div>
              <div>
                <span className='mb-1 block text-xs font-medium text-gray-500 dark:text-zinc-400'>
                  Small
                </span>
                <DsProgressMemo value={50} size='small' variant='primary' />
              </div>
              <div>
                <span className='mb-1 block text-xs font-medium text-gray-500 dark:text-zinc-400'>
                  Normal
                </span>
                <DsProgressMemo value={50} size='normal' variant='primary' />
              </div>
              <div>
                <span className='mb-1 block text-xs font-medium text-gray-500 dark:text-zinc-400'>
                  Medium
                </span>
                <DsProgressMemo value={50} size='medium' variant='primary' />
              </div>
              <div>
                <span className='mb-1 block text-xs font-medium text-gray-500 dark:text-zinc-400'>
                  Large
                </span>
                <DsProgressMemo value={50} size='large' variant='primary' />
              </div>
            </div>
          ),
        })}

        {/* Section 3: Indeterminate Loading State */}
        {sectionView({
          title: 'Indeterminate Loading State',
          children: () => (
            <div className='w-full space-y-4'>
              <div>
                <span className='mb-1 block text-xs font-medium text-gray-500 dark:text-zinc-400'>
                  Indeterminate Primary
                </span>
                <DsProgressMemo isIndeterminate={true} variant='primary' />
              </div>
              <div>
                <span className='mb-1 block text-xs font-medium text-gray-500 dark:text-zinc-400'>
                  Indeterminate Info
                </span>
                <DsProgressMemo isIndeterminate={true} variant='info' />
              </div>
              <div>
                <span className='mb-1 block text-xs font-medium text-gray-500 dark:text-zinc-400'>
                  Indeterminate Success
                </span>
                <DsProgressMemo isIndeterminate={true} variant='success' />
              </div>
            </div>
          ),
        })}

        {model.showCode && (
          <div className='relative w-full overflow-x-auto rounded-lg border border-gray-800 bg-gray-900 p-5 font-mono text-xs text-gray-100 shadow-lg'>
            <div className='mb-3 flex items-center justify-between border-b border-gray-800 pb-3 font-sans text-xs text-gray-400'>
              <span className='font-semibold text-green-400'>JSX / HTML</span>
              <span className='text-gray-500 dark:text-zinc-400'>
                Progress Component Code
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
