import { ButtonMemo as DsButtonMemo } from '@rinn7e/realworld-design-system/element/button/component'
import { IconMemo as DsIconMemo } from '@rinn7e/realworld-design-system/element/icon/component'
import { TitleMemo as DsTitleMemo } from '@rinn7e/realworld-design-system/element/title/component'
import { HeroMemo as DsHeroMemo } from '@rinn7e/realworld-design-system/layout/hero/component'
import { Code2, Search, Sparkles } from 'lucide-react'
import { memo } from 'react'

import {
  DEFAULT_SECTION_BOX_CLASS,
  SectionViewMemo,
} from '@/component/section-view'

import { type Props, PropsEq } from './type'

const IconPageComponent = ({ model, dispatch }: Props) => {
  const code = `<DsIconMemo children={() => <Sparkles className='h-6 w-6 text-green-600' /> />
<DsIconMemo children={() => <Search className='h-6 w-6 text-sky-500' /> />`

  return (
    <div
      data-component='IconPage'
      className='flex w-full flex-col gap-8 text-left'
    >
      <DsHeroMemo
        color='gray'
        size='small'
        className='w-full rounded-lg border border-gray-200 bg-gray-50 px-6 py-6 dark:border-zinc-800 dark:bg-zinc-950'
      >
        <>
          <div className='pb-1 text-xs font-bold tracking-wider text-green-600 uppercase'>
            ELEMENTS / ICON
          </div>
          <DsTitleMemo
            size={2}
            className='pb-2 font-extrabold text-gray-900 dark:text-zinc-100'
          >
            Icon
          </DsTitleMemo>
          <p className='text-base text-gray-600 dark:text-zinc-400'>
            Icon wrapper container for Lucide icons with consistent sizing and
            alignment.
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

        <SectionViewMemo
          title='Icon Container Wrappers'
          boxClassName={DEFAULT_SECTION_BOX_CLASS}
        >
          <div className='flex items-center gap-6 text-gray-700 dark:text-zinc-300'>
            <DsIconMemo>
              <Sparkles className='h-6 w-6 text-green-600' />
            </DsIconMemo>
            <DsIconMemo>
              <Search className='h-6 w-6 text-sky-500' />
            </DsIconMemo>
          </div>
        </SectionViewMemo>

        {model.showCode && (
          <div className='relative flex w-full flex-col gap-3 overflow-x-auto rounded-lg border border-gray-800 bg-gray-900 p-5 font-mono text-xs text-gray-100 shadow-lg'>
            <div className='flex items-center justify-between border-b border-gray-800 pb-3 font-sans text-xs text-gray-400'>
              <span className='font-semibold text-green-400'>JSX / HTML</span>
              <span className='text-gray-500 dark:text-zinc-400'>
                Icon Component Code
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

export const IconPageMemo = memo(IconPageComponent, PropsEq.equals)
