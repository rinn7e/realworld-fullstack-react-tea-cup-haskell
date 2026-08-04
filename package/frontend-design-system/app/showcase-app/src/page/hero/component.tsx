import { ButtonMemo as DsButtonMemo } from '@rinn7e/realworld-design-system/element/button/component'
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

export const HeroPage: React.FC<Props> = ({ model, dispatch }) => {
  const code = `// Hero Color Variants (white, green, dark-green, sky, amber, red, gray)
<DsHeroMemo color='white' size='small'>White Hero Banner</DsHeroMemo>
<DsHeroMemo color='green' size='small'>Green Hero Banner</DsHeroMemo>
<DsHeroMemo color='dark-green' size='small'>Dark Green Hero Banner</DsHeroMemo>
<DsHeroMemo color='sky' size='small'>Sky Hero Banner</DsHeroMemo>
<DsHeroMemo color='amber' size='small'>Amber Hero Banner</DsHeroMemo>
<DsHeroMemo color='red' size='small'>Red Hero Banner</DsHeroMemo>
<DsHeroMemo color='gray' size='small'>Gray Hero Banner</DsHeroMemo>`

  return (
    <div data-component='HeroPage' className='w-full space-y-8 text-left'>
      <DsHeroMemo
        color='gray'
        size='small'
        className='w-full rounded-lg border border-gray-200 bg-gray-50 px-6 py-6 dark:border-zinc-800 dark:bg-zinc-950'
      >
        <>
          <div className='mb-1 text-xs font-bold tracking-wider text-green-600 uppercase'>
            LAYOUT / HERO
          </div>
          <DsTitleMemo
            size={2}
            className='mb-2 font-extrabold text-gray-900 dark:text-zinc-100'
          >
            Hero
          </DsTitleMemo>
          <p className='text-base text-gray-600 dark:text-zinc-400'>
            Large banner header container for page tops and hero callouts.
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
              <DsHeroMemo
                color='white'
                size='small'
                className='rounded-lg border'
              >
                <DsTitleMemo
                  size={3}
                  className='text-gray-900 dark:text-zinc-100'
                >
                  White Hero Banner
                </DsTitleMemo>
              </DsHeroMemo>
              <DsHeroMemo color='green' size='small' className='rounded-lg'>
                <DsTitleMemo size={3} className='text-white'>
                  Green Hero Banner
                </DsTitleMemo>
              </DsHeroMemo>
              <DsHeroMemo
                color='dark-green'
                size='small'
                className='rounded-lg'
              >
                <DsTitleMemo size={3} className='text-white'>
                  Dark Green Hero Banner
                </DsTitleMemo>
              </DsHeroMemo>
              <DsHeroMemo color='sky' size='small' className='rounded-lg'>
                <DsTitleMemo size={3} className='text-white'>
                  Sky Hero Banner
                </DsTitleMemo>
              </DsHeroMemo>
              <DsHeroMemo color='amber' size='small' className='rounded-lg'>
                <DsTitleMemo size={3} className='text-white'>
                  Amber Hero Banner
                </DsTitleMemo>
              </DsHeroMemo>
              <DsHeroMemo color='red' size='small' className='rounded-lg'>
                <DsTitleMemo size={3} className='text-white'>
                  Red Hero Banner
                </DsTitleMemo>
              </DsHeroMemo>
              <DsHeroMemo
                color='gray'
                size='small'
                className='rounded-lg border'
              >
                <DsTitleMemo
                  size={3}
                  className='text-gray-900 dark:text-zinc-100'
                >
                  Gray Hero Banner
                </DsTitleMemo>
              </DsHeroMemo>
            </div>
          ),
        })}

        {model.showCode && (
          <div className='relative w-full overflow-x-auto rounded-lg border border-gray-800 bg-gray-900 p-5 font-mono text-xs text-gray-100 shadow-lg'>
            <div className='mb-3 flex items-center justify-between border-b border-gray-800 pb-3 font-sans text-xs text-gray-400'>
              <span className='font-semibold text-green-400'>JSX / HTML</span>
              <span className='text-gray-500 dark:text-zinc-400'>
                Hero Component Code
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
