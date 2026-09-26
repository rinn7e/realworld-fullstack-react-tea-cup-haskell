import { TitleMemo as DsTitleMemo } from '@rinn7e/realworld-design-system/element/title/component'
import { HeroMemo as DsHeroMemo } from '@rinn7e/realworld-design-system/layout/hero/component'
import { DotLoadingMemo as DsDotLoadingMemo } from '@rinn7e/realworld-design-system/misc/dot-loading/component'
import { memo } from 'react'

import {
  DEFAULT_SECTION_BOX_CLASS,
  SectionViewMemo,
} from '@/component/section-view'

import { type Props, PropsEq } from './type'

const DotLoadingPageComponent = (_props: Props) => {
  return (
    <div
      data-component='DotLoadingPage'
      className='flex w-full flex-col gap-8 text-left'
    >
      <DsHeroMemo
        color='gray'
        size='small'
        className='w-full rounded-lg border border-gray-200 bg-gray-50 px-6 py-6 dark:border-zinc-800 dark:bg-zinc-950'
      >
        <>
          <div className='pb-1 text-xs font-bold tracking-wider text-green-600 uppercase'>
            MISC / DOT LOADING
          </div>
          <DsTitleMemo
            size={2}
            className='pb-2 font-extrabold text-gray-900 dark:text-zinc-100'
          >
            Dot Loading
          </DsTitleMemo>
          <p className='text-base text-gray-600 dark:text-zinc-400'>
            Subtle inline text 3-dot loading animation element.
          </p>
        </>
      </DsHeroMemo>

      <div className='flex w-full flex-col gap-6'>
        <SectionViewMemo
          title='3-Dot Inline Loading Animation'
          boxClassName={DEFAULT_SECTION_BOX_CLASS}
        >
          <div className='flex flex-col gap-4'>
            <div className='flex items-center gap-2 text-lg text-gray-700 dark:text-zinc-300'>
              Loading content <DsDotLoadingMemo />
            </div>
            <div className='flex items-center gap-2 text-sm font-medium text-green-600'>
              Fetching data <DsDotLoadingMemo className='text-green-600' />
            </div>
          </div>
        </SectionViewMemo>
      </div>
    </div>
  )
}

export const DotLoadingPageMemo = memo(DotLoadingPageComponent, PropsEq.equals)
