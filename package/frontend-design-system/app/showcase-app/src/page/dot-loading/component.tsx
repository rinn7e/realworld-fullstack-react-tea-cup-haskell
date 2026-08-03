import { TitleMemo as DsTitleMemo } from '@rinn7e/realworld-design-system/element/title/component'
import { HeroMemo as DsHeroMemo } from '@rinn7e/realworld-design-system/layout/hero/component'
import { DotLoadingMemo as DsDotLoadingMemo } from '@rinn7e/realworld-design-system/misc/dot-loading/component'
import React from 'react'

import { sectionView } from '../../component/section-view'
import type { Model, Msg } from './type'

interface Props {
  model: Model
  dispatch: (msg: Msg) => void
}

export const DotLoadingPage: React.FC<Props> = () => {
  return (
    <div data-component='DotLoadingPage' className='w-full space-y-8 text-left'>
      <DsHeroMemo
        variant='default'
        size='small'
        className='rounded-lg bg-gray-50 border border-gray-200 px-6 py-6 w-full'>

          <>
            <div className='mb-1 text-xs font-bold tracking-wider text-green-600 uppercase'>
              MISC / DOT LOADING
            </div>
            <DsTitleMemo
              size={2}
              className='mb-2 font-extrabold text-gray-900'>Dot Loading</DsTitleMemo>
            <p className='text-base text-gray-600'>
              Subtle inline text 3-dot loading animation element.
            </p>
          </>
        
</DsHeroMemo>

      <div className='flex w-full flex-col gap-6'>
        {sectionView({
          title: '3-Dot Inline Loading Animation',
          children: () => (
            <div className='flex flex-col gap-4'>
              <div className='flex items-center gap-2 text-lg text-gray-700'>
                Loading content <DsDotLoadingMemo />
              </div>
              <div className='flex items-center gap-2 text-sm font-medium text-green-600'>
                Fetching data <DsDotLoadingMemo className='text-green-600' />
              </div>
            </div>
          ),
        })}
      </div>
    </div>
  )
}
